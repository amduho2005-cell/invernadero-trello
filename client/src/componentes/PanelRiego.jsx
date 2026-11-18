import { useEffect, useRef, useState } from "react";
import { registrarRiego, repartirErrores } from "../api.js";
import Campo from "./Campo.jsx";
import Mensaje from "./Mensaje.jsx";

const CANTIDAD_SUGERIDA = "500";

// Riego rápido de hoy desde la lista (spec 07). Sin fecha ni cuidador: la API pone hoy.
export default function PanelRiego({ planta, alCancelar, alGuardar }) {
  const [cantidad, setCantidad] = useState(CANTIDAD_SUGERIDA);
  const [error, setError] = useState("");
  const [generales, setGenerales] = useState([]);
  const [enviando, setEnviando] = useState(false);
  // El estado tarda un render en desactivar el botón: el ref frena el doble toque (CA-07.3).
  const enCurso = useRef(false);
  const campo = useRef(null);
  const idCampo = `cantidad-${planta._id}`;

  useEffect(() => {
    campo.current?.focus();
  }, []);

  // Tras un error de validación, el foco vuelve al campo marcado.
  useEffect(() => {
    if (error) campo.current?.focus();
  }, [error]);

  async function enviar(evento) {
    evento.preventDefault();
    if (enCurso.current) return;
    enCurso.current = true;
    setEnviando(true);
    setError("");
    setGenerales([]);
    try {
      const texto = cantidad.trim();
      await registrarRiego({
        planta: planta._id,
        cantidadMl: texto === "" ? undefined : Number(texto),
      });
      alGuardar();
    } catch (fallo) {
      if (fallo.estado === 400) {
        const { porCampo, generales } = repartirErrores(fallo, ["cantidadMl"]);
        setError(porCampo.cantidadMl ?? "");
        setGenerales(generales);
      } else if (fallo.estado === 404) {
        setGenerales(["No encontramos esa planta. Puede que se haya borrado."]);
      } else {
        setGenerales([
          "No pudimos guardar el riego. Revisa la conexión y vuelve a intentarlo.",
        ]);
      }
      enCurso.current = false;
      setEnviando(false);
    }
  }

  return (
    <div className="panel-riego">
      {generales.map((mensaje) => (
        <Mensaje key={mensaje} tipo="error">
          {mensaje}
        </Mensaje>
      ))}
      <form
        className="panel-riego-formulario"
        onSubmit={enviar}
        noValidate
        aria-label={`Registrar un riego de ${planta.nombre}`}
      >
        <Campo
          id={idCampo}
          etiqueta="Cantidad (ml)"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          required
          value={cantidad}
          onChange={(evento) => setCantidad(evento.target.value)}
          error={error}
          disabled={enviando}
          ref={campo}
        />
        <p className="panel-riego-fecha">Fecha: hoy</p>
        <div className="panel-riego-botones">
          <button
            type="submit"
            className="boton-secundario"
            disabled={enviando}
          >
            {enviando ? "Guardando…" : "Guardar riego"}
          </button>
          <button
            type="button"
            className="boton-secundario"
            disabled={enviando}
            onClick={alCancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
