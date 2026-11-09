const MESES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

// «28 oct 2026», en hora local.
export function fechaCorta(valor) {
  const fecha = new Date(valor);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

// «AAAA-MM-DD» en hora local (hoy por defecto), para los límites del campo de fecha.
export function isoLocal(valor = new Date()) {
  const fecha = new Date(valor);
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}
