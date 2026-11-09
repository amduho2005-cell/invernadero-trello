import { useEffect, useState } from "react";
import Plantas from "./pantallas/Plantas.jsx";
import DetallePlanta from "./pantallas/DetallePlanta.jsx";

// Dos pantallas, sin librería de rutas (spec 02, sección 1).
// El hash solo sirve para que el botón Atrás vuelva a la lista.
export default function App() {
  const [plantaAbierta, setPlantaAbierta] = useState(null);

  useEffect(() => {
    // shortcut: recargar en «#planta-<id>» vuelve a la lista porque no hay GET de una planta; añadirlo si se pide el enlace directo.
    if (location.hash) {
      history.replaceState(null, "", location.pathname);
    }
    const alCambiarHistorial = () => {
      if (!location.hash.startsWith("#planta-")) {
        setPlantaAbierta(null);
      }
    };
    addEventListener("popstate", alCambiarHistorial);
    return () => removeEventListener("popstate", alCambiarHistorial);
  }, []);

  useEffect(() => {
    scrollTo(0, 0);
  }, [plantaAbierta]);

  function abrir(planta) {
    history.pushState(null, "", `#planta-${planta._id}`);
    setPlantaAbierta(planta);
  }

  return (
    <>
      <header className="cabecera">
        <p className="marca">Invernadero Encantado</p>
      </header>
      <main className="pagina">
        {plantaAbierta ? (
          <DetallePlanta
            key={plantaAbierta._id}
            planta={plantaAbierta}
            alVolver={() => history.back()}
          />
        ) : (
          <Plantas alAbrir={abrir} />
        )}
      </main>
    </>
  );
}
