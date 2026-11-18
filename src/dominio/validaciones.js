// Reglas de una planta nueva, sin base de datos. Mismos mensajes que el modelo Planta,
// que sigue validando como segunda barrera.

const TEXTOS_OBLIGATORIOS = [
  ["nombre", "El nombre es obligatorio"],
  ["especie", "La especie es obligatoria"],
  ["ubicacion", "La ubicación es obligatoria"],
];

function mensajeIntervalo(valor) {
  if (valor === undefined || valor === null || valor === "") {
    return "El intervalo de riego es obligatorio";
  }
  if (!Number.isInteger(valor)) {
    return "El intervalo de riego debe ser un número entero de días";
  }
  if (valor < 1) {
    return "El intervalo de riego debe ser de al menos 1 día";
  }
  return null;
}

function validarPlanta(datos) {
  const { intervaloRiegoDias, ...textos } = datos ?? {};
  const detalles = TEXTOS_OBLIGATORIOS.filter(
    ([campo]) => typeof textos[campo] !== "string" || !textos[campo].trim(),
  ).map(([campo, mensaje]) => ({ campo, mensaje }));
  const mensaje = mensajeIntervalo(intervaloRiegoDias);
  if (mensaje) {
    detalles.push({ campo: "intervaloRiegoDias", mensaje });
  }
  return detalles;
}

module.exports = { validarPlanta };
