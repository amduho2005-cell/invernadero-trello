// Reglas de formato de una planta o un riego nuevos, sin base de datos. Mismos mensajes
// que los modelos, que siguen validando como segunda barrera.

const { interpretarFecha, esFechaFutura } = require("./fechas");

const ID_VALIDO = /^[0-9a-fA-F]{24}$/;

const TEXTOS_OBLIGATORIOS = [
  ["nombre", "El nombre es obligatorio"],
  ["especie", "La especie es obligatoria"],
  ["ubicacion", "La ubicación es obligatoria"],
];

const estaVacio = (valor) =>
  valor === undefined || valor === null || valor === "";

function mensajeIntervalo(valor) {
  if (estaVacio(valor)) {
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

function mensajePlanta(valor) {
  if (estaVacio(valor)) {
    return "La planta es obligatoria";
  }
  if (typeof valor !== "string" || !ID_VALIDO.test(valor)) {
    return "La planta no tiene un identificador válido";
  }
  return null;
}

function mensajeFecha(valor, ahora) {
  if (estaVacio(valor)) {
    return null; // sin fecha, el riego es de hoy
  }
  const interpretada = interpretarFecha(valor);
  const fecha =
    typeof interpretada === "string" || typeof interpretada === "number"
      ? new Date(interpretada)
      : interpretada;
  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) {
    return "La fecha no es válida";
  }
  if (esFechaFutura(fecha, ahora)) {
    return "Un riego no puede tener fecha futura";
  }
  return null;
}

function mensajeCantidad(valor) {
  if (estaVacio(valor)) {
    return "La cantidad de agua es obligatoria";
  }
  if (!Number.isInteger(valor)) {
    return "La cantidad de agua debe ser un número entero de mililitros";
  }
  if (valor < 1) {
    return "La cantidad de agua debe ser mayor que 0";
  }
  return null;
}

// No comprueba que la fecha sea posterior al registro de la planta: eso necesita la base de datos.
function validarRiego(datos, ahora) {
  const { planta, fecha, cantidadMl } = datos ?? {};
  return [
    ["planta", mensajePlanta(planta)],
    ["fecha", mensajeFecha(fecha, ahora)],
    ["cantidadMl", mensajeCantidad(cantidadMl)],
  ]
    .filter(([, mensaje]) => mensaje)
    .map(([campo, mensaje]) => ({ campo, mensaje }));
}

module.exports = { validarPlanta, validarRiego };
