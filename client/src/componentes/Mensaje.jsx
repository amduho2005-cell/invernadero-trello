import { IconoError, IconoVisto } from "./Iconos.jsx";

// tipo: "exito" | "error". role={null} cuando ya está dentro de una región viva.
export default function Mensaje({
  tipo,
  role = tipo === "error" ? "alert" : "status",
  children,
}) {
  return (
    <div className={`mensaje mensaje-${tipo}`} role={role ?? undefined}>
      {tipo === "error" ? <IconoError /> : <IconoVisto />}
      <p>{children}</p>
    </div>
  );
}
