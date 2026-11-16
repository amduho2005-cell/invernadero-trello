import { useEffect, useRef, useState } from "react";
import { listarRiegos, registrarRiego, repartirErrores } from "../api.js";
import { fechaCorta, isoLocal } from "../formato.js";
import Campo from "../componentes/Campo.jsx";
import ListaVacia from "../componentes/ListaVacia.jsx";
import Mensaje from "../componentes/Mensaje.jsx";
import { IconoVolver } from "../componentes/Iconos.jsx";

const CAMPOS = ["cantidadMl", "fecha", "cuidador"];
const VACIO = { cantidadMl: "", fecha: "", cuidador: "" };

function ordenarPorFecha(riegos) {
  return [...riegos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export default function DetallePlanta({ planta, alVolver }) {
  const [riegos, setRiegos] = useState([]);
  const [estado, setEstado] = useState("cargando"); // cargando | listo | no-existe | error
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({ porCampo: {}, generales: [] });
  const [exito, setExito] = useState("");
  const [enviando, setEnviando] = useState(false);
  const titulo = useRef(null);
  const tituloHistorial = useRef(null);
  const formulario = useRef(null);
  const primerCampo = useRef(null);

  function cargar() {
    listarRiegos(planta._id)
      .then((lista) => {
        setRiegos(lista);
        setEstado("listo");
      })
      .catch((error) =>
        setEstado(error.estado === 404 ? "no-existe" : "error"),
      );
  }

  // App monta una pantalla nueva por planta (key), así que basta con el montaje.
  useEffect(() => {
    titulo.current?.focus();
    cargar();
    // oxlint-disable-next-line react-hooks/exhaustive-deps
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
      const cantidad = datos.cantidadMl.trim();
      const riego = await registrarRiego({
        planta: planta._id,
        cantidadMl: cantidad === "" ? undefined : Number(cantidad),
        fecha: datos.fecha || undefined,
        cuidador: datos.cuidador.trim() || undefined,
      });
      // Si el historial no cargó, no se inventa uno con solo el riego nuevo.
      if (estado === "listo") {
        setRiegos(ordenarPorFecha([...riegos, riego]));
      }
      setDatos(VACIO);
      setExito(`Riego guardado para ${planta.nombre}.`);
    } catch (error) {
      if (error.estado === 400) {
        setErrores(repartirErrores(error, CAMPOS));
      } else if (error.estado === 404) {
        setEstado("no-existe");
      } else {
        setErrores({
          porCampo: {},
          generales: [
            "No pudimos conectar con el invernadero para guardar el riego. Vuelve a intentarlo.",
          ],
        });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <a
        href="#plantas"
        className="enlace-volver"
        onClick={(evento) => {
          evento.preventDefault();
          alVolver();
        }}
      >
        <IconoVolver />
        Volver a plantas
      </a>
      {/* Un único h1 para que el foco no se pierda si la planta resulta no existir. */}
      <h1 ref={titulo} tabIndex={-1}>
        {estado === "no-existe" ? "Planta no encontrada" : planta.nombre}
      </h1>

      {estado === "no-existe" ? (
        <div className="seccion">
          <Mensaje tipo="error">
            No encontramos esa planta. Puede que se haya borrado.
          </Mensaje>
        </div>
      ) : (
        <>
          <dl className="datos-planta">
            <div>
              <dt>Especie</dt>
              <dd>{planta.especie}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>{planta.ubicacion}</dd>
            </div>
            <div>
              <dt>Riego cada</dt>
              <dd>
                {planta.intervaloRiegoDias}{" "}
                {planta.intervaloRiegoDias === 1 ? "día" : "días"}
              </dd>
            </div>
          </dl>

          {/* El formulario va antes que el historial: anotar un riego es la tarea frecuente. */}
          <section className="seccion tarjeta" aria-labelledby="titulo-riego">
            <h2 id="titulo-riego">Registrar un riego</h2>
            {errores.generales.map((mensaje) => (
              <Mensaje key={mensaje} tipo="error">
                {mensaje}
              </Mensaje>
            ))}
            <form ref={formulario} onSubmit={enviar} noValidate>
              <Campo
                id="cantidadMl"
                etiqueta="Cantidad (ml)"
                ayuda="Medio litro son 500 ml."
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                required
                value={datos.cantidadMl}
                onChange={cambiar}
                error={errores.porCampo.cantidadMl}
                ref={primerCampo}
              />
              <Campo
                id="fecha"
                etiqueta="Fecha"
                ayuda="Déjala vacía si la regaste hoy."
                type="date"
                min={planta.createdAt ? isoLocal(planta.createdAt) : undefined}
                max={isoLocal()}
                value={datos.fecha}
                onChange={cambiar}
                error={errores.porCampo.fecha}
              />
              <Campo
                id="cuidador"
                etiqueta="Cuidador"
                ayuda="Opcional."
                value={datos.cuidador}
                onChange={cambiar}
                error={errores.porCampo.cuidador}
              />
              <button
                type="submit"
                className="boton-primario"
                disabled={enviando}
              >
                {enviando ? "Guardando…" : "Registrar riego"}
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

          <section className="seccion" aria-labelledby="titulo-historial">
            <h2 id="titulo-historial" ref={tituloHistorial} tabIndex={-1}>
              Historial de riegos
            </h2>
            {/* Región viva desde el montaje para que el lector anuncie la carga (CA-P.4). */}
            <div role="status">
              {estado === "cargando" && (
                <p className="texto-secundario">Cargando riegos…</p>
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
                    tituloHistorial.current?.focus();
                    setEstado("cargando");
                    cargar();
                  }}
                >
                  Volver a intentarlo
                </button>
              </div>
            )}
            {estado === "listo" && riegos.length === 0 && (
              <ListaVacia
                texto="Esta planta todavía no tiene riegos."
                accion="Registrar el primer riego"
                alPulsar={() => primerCampo.current?.focus()}
              />
            )}
            {estado === "listo" && riegos.length > 0 && (
              <ul className="historial">
                {riegos.map((riego) => (
                  <li key={riego._id}>
                    <p className="historial-fecha">{fechaCorta(riego.fecha)}</p>
                    <p className="texto-secundario">
                      {riego.cantidadMl} ml · {riego.cuidador || "sin cuidador"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  );
}
