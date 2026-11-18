import { Fragment, useEffect, useRef, useState } from "react";
import { listarPlantas, registrarPlanta, repartirErrores } from "../api.js";
import Campo from "../componentes/Campo.jsx";
import ListaVacia from "../componentes/ListaVacia.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import PanelRiego from "../componentes/PanelRiego.jsx";

const CAMPOS = ["nombre", "especie", "ubicacion", "intervaloRiegoDias"];
const VACIO = {
  nombre: "",
  especie: "",
  ubicacion: "",
  intervaloRiegoDias: "",
};

export default function Plantas({ alAbrir }) {
  const [plantas, setPlantas] = useState([]);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | error
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({ porCampo: {}, generales: [] });
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const titulo = useRef(null);
  const formulario = useRef(null);
  const primerCampo = useRef(null);
  // Riego rápido (spec 07): un solo panel abierto; «Regada hoy» solo vive en pantalla.
  const [panelAbierto, setPanelAbierto] = useState(null);
  const [regadasHoy, setRegadasHoy] = useState(new Set());
  const [exitosRiego, setExitosRiego] = useState({});
  const botonesRegar = useRef({});
  const devolverFocoA = useRef(null);

  function cargar() {
    listarPlantas()
      .then((lista) => {
        setPlantas(lista);
        setEstado("listo");
      })
      .catch(() => setEstado("error"));
  }

  useEffect(() => {
    titulo.current?.focus();
    cargar();
  }, []);

  // Al cerrar un panel, el foco vuelve a su botón «Regar».
  useEffect(() => {
    if (panelAbierto === null && devolverFocoA.current) {
      botonesRegar.current[devolverFocoA.current]?.focus();
      devolverFocoA.current = null;
    }
  }, [panelAbierto]);

  function cerrarPanel(planta) {
    devolverFocoA.current = planta._id;
    setPanelAbierto(null);
  }

  function riegoGuardado(planta) {
    setRegadasHoy(new Set(regadasHoy).add(planta._id));
    setExitosRiego({
      ...exitosRiego,
      [planta._id]: `Riego guardado para ${planta.nombre}.`,
    });
    cerrarPanel(planta);
  }

  // Tras un error de validación, el foco va al primer campo marcado.
  useEffect(() => {
    formulario.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [errores]);

  function cambiar(evento) {
    setExito("");
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setExito("");
    setErrores({ porCampo: {}, generales: [] });
    try {
      const intervalo = datos.intervaloRiegoDias.trim();
      const planta = await registrarPlanta({
        ...datos,
        intervaloRiegoDias: intervalo === "" ? undefined : Number(intervalo),
      });
      // Si la lista no cargó, no se inventa una lista con solo la planta nueva.
      if (estado === "listo") {
        setPlantas([...plantas, planta]);
      }
      setDatos(VACIO);
      setExito(`Planta registrada: ${planta.nombre}.`);
    } catch (error) {
      if (error.estado === 400) {
        setErrores(repartirErrores(error, CAMPOS));
      } else {
        setErrores({
          porCampo: {},
          generales: [
            "No pudimos conectar con el invernadero para guardar la planta. Vuelve a intentarlo.",
          ],
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1 ref={titulo} tabIndex={-1}>
        Plantas
      </h1>

      <section className="seccion" aria-labelledby="titulo-lista">
        <h2 id="titulo-lista" className="solo-lector">
          Lista de plantas
        </h2>
        {/* Región viva desde el montaje para que el lector anuncie la carga (CA-P.4). */}
        <div role="status">
          {estado === "cargando" && (
            <p className="texto-secundario">Cargando plantas…</p>
          )}
        </div>
        {estado === "error" && (
          <div className="error-carga">
            <Mensaje tipo="error">
              No pudimos conectar con el invernadero. Vuelve a intentarlo.
            </Mensaje>
            <button
              type="button"
              className="boton-secundario"
              onClick={() => {
                // El botón desaparece: el foco pasa al título para no perderse (CA-P.5).
                titulo.current?.focus();
                setEstado("cargando");
                cargar();
              }}
            >
              Volver a intentarlo
            </button>
          </div>
        )}
        {estado === "listo" && plantas.length === 0 && (
          <ListaVacia
            texto="Todavía no hay plantas registradas."
            accion="Registrar la primera planta"
            alPulsar={() => primerCampo.current?.focus()}
          />
        )}
        {estado === "listo" && plantas.length > 0 && (
          // Roles explícitos: en el móvil la tabla pasa a display:block y Safari pierde su semántica.
          <table className="tabla-plantas" role="table">
            <thead role="rowgroup">
              <tr role="row">
                <th scope="col" role="columnheader">
                  Nombre
                </th>
                <th scope="col" role="columnheader">
                  Especie
                </th>
                <th scope="col" role="columnheader">
                  Ubicación
                </th>
                <th scope="col" role="columnheader">
                  Riego cada
                </th>
                <th scope="col" role="columnheader">
                  <span className="solo-lector">Riego rápido</span>
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {plantas.map((planta) => (
                <Fragment key={planta._id}>
                  <tr
                    role="row"
                    className={
                      panelAbierto === planta._id ? "fila-con-panel" : undefined
                    }
                  >
                    <td data-etiqueta="Nombre" role="cell">
                      <a
                        href={`#planta-${planta._id}`}
                        className="enlace-planta"
                        onClick={(evento) => {
                          evento.preventDefault();
                          alAbrir(planta);
                        }}
                      >
                        {planta.nombre}
                      </a>
                      {regadasHoy.has(planta._id) && (
                        <span className="etiqueta-regada">Regada hoy</span>
                      )}
                    </td>
                    <td data-etiqueta="Especie" role="cell">
                      {planta.especie}
                    </td>
                    <td data-etiqueta="Ubicación" role="cell">
                      {planta.ubicacion}
                    </td>
                    <td data-etiqueta="Riego cada" role="cell">
                      {planta.intervaloRiegoDias}{" "}
                      {planta.intervaloRiegoDias === 1 ? "día" : "días"}
                    </td>
                    <td className="celda-regar" role="cell">
                      {panelAbierto !== planta._id && (
                        <>
                          <button
                            type="button"
                            className="boton-secundario"
                            ref={(boton) => {
                              botonesRegar.current[planta._id] = boton;
                            }}
                            onClick={() => setPanelAbierto(planta._id)}
                          >
                            Regar
                            <span className="solo-lector">
                              {" "}
                              {planta.nombre}
                            </span>
                          </button>
                          <div className="region-estado" role="status">
                            {exitosRiego[planta._id] && (
                              <Mensaje tipo="exito" role={null}>
                                {exitosRiego[planta._id]}
                              </Mensaje>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                  {panelAbierto === planta._id && (
                    <tr className="fila-panel" role="row">
                      <td colSpan={5} role="cell">
                        <PanelRiego
                          planta={planta}
                          alCancelar={() => cerrarPanel(planta)}
                          alGuardar={() => riegoGuardado(planta)}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="seccion tarjeta" aria-labelledby="titulo-registro">
        <h2 id="titulo-registro">Registrar una planta</h2>
        {errores.generales.map((mensaje) => (
          <Mensaje key={mensaje} tipo="error">
            {mensaje}
          </Mensaje>
        ))}
        <form ref={formulario} onSubmit={enviar} noValidate>
          <Campo
            id="nombre"
            etiqueta="Nombre"
            required
            value={datos.nombre}
            onChange={cambiar}
            error={errores.porCampo.nombre}
            ref={primerCampo}
          />
          <Campo
            id="especie"
            etiqueta="Especie"
            required
            value={datos.especie}
            onChange={cambiar}
            error={errores.porCampo.especie}
          />
          <Campo
            id="ubicacion"
            etiqueta="Ubicación"
            ayuda="Por ejemplo: Mesa 2"
            required
            value={datos.ubicacion}
            onChange={cambiar}
            error={errores.porCampo.ubicacion}
          />
          <Campo
            id="intervaloRiegoDias"
            etiqueta="Riego cada (días)"
            ayuda="Cada cuántos días hay que regarla. Mínimo 1."
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            required
            value={datos.intervaloRiegoDias}
            onChange={cambiar}
            error={errores.porCampo.intervaloRiegoDias}
          />
          <button type="submit" className="boton-primario" disabled={enviando}>
            {enviando ? "Guardando…" : "Registrar planta"}
          </button>
        </form>
        {/* Región viva siempre presente: así el lector anuncia el texto cuando cambia. */}
        <div className="region-estado" role="status">
          {exito && (
            <Mensaje tipo="exito" role={null}>
              {exito}
            </Mensaje>
          )}
        </div>
      </section>
    </>
  );
}
