import { useEffect, useRef, useState } from "react";
import { listarPlantas, registrarPlanta, repartirErrores } from "../api.js";
import Campo from "../componentes/Campo.jsx";
import ListaVacia from "../componentes/ListaVacia.jsx";
import Mensaje from "../componentes/Mensaje.jsx";

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
        {estado === "cargando" && (
          <p className="texto-secundario">Cargando plantas…</p>
        )}
        {estado === "error" && (
          <div className="error-carga">
            <Mensaje tipo="error">
              No pudimos conectar con el invernadero. Vuelve a intentarlo.
            </Mensaje>
            <button
              type="button"
              className="boton-secundario"
              onClick={() => {
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
              </tr>
            </thead>
            <tbody role="rowgroup">
              {plantas.map((planta) => (
                <tr key={planta._id} role="row">
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
                </tr>
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
