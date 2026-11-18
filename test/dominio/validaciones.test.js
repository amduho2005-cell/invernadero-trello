const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const {
  validarPlanta,
  validarRiego,
} = require("../../src/dominio/validaciones");

const valida = {
  nombre: "Mandrágora",
  especie: "Mandragora officinarum",
  ubicacion: "Invernadero norte",
  intervaloRiegoDias: 3,
};

const mensajes = (detalles) => detalles.map((d) => d.mensaje);

describe("validarPlanta", () => {
  test("CA-04.1: una planta válida no tiene detalles", () => {
    assert.deepEqual(validarPlanta(valida), []);
  });

  test("CA-04.2: sin especie y con intervalo 0 da dos detalles en orden", () => {
    const { especie, ...sinEspecie } = valida;
    assert.deepEqual(validarPlanta({ ...sinEspecie, intervaloRiegoDias: 0 }), [
      { campo: "especie", mensaje: "La especie es obligatoria" },
      {
        campo: "intervaloRiegoDias",
        mensaje: "El intervalo de riego debe ser de al menos 1 día",
      },
    ]);
  });

  test("CA-04.3: un nombre con solo espacios es obligatorio", () => {
    assert.deepEqual(validarPlanta({ ...valida, nombre: "   " }), [
      { campo: "nombre", mensaje: "El nombre es obligatorio" },
    ]);
  });

  for (const intervalo of [2.5, "tres"]) {
    test(`CA-04.4: un intervalo de ${JSON.stringify(intervalo)} no es entero`, () => {
      assert.deepEqual(
        mensajes(validarPlanta({ ...valida, intervaloRiegoDias: intervalo })),
        ["El intervalo de riego debe ser un número entero de días"],
      );
    });
  }

  test("sin datos, devuelve los cuatro campos en orden", () => {
    assert.deepEqual(validarPlanta(undefined), [
      { campo: "nombre", mensaje: "El nombre es obligatorio" },
      { campo: "especie", mensaje: "La especie es obligatoria" },
      { campo: "ubicacion", mensaje: "La ubicación es obligatoria" },
      {
        campo: "intervaloRiegoDias",
        mensaje: "El intervalo de riego es obligatorio",
      },
    ]);
  });
});

describe("validarRiego", () => {
  // 18 de noviembre de 2026 a las 00:01, hora local.
  const ahora = new Date(2026, 10, 18, 0, 1);
  const riego = { planta: "665f1c2a9b1e8a0012345678", cantidadMl: 500 };

  test("CA-05.1: planta válida y 500 ml sin fecha no tiene detalles", () => {
    assert.deepEqual(validarRiego(riego, ahora), []);
  });

  for (const [cantidad, mensaje] of [
    [0, "La cantidad de agua debe ser mayor que 0"],
    [-5, "La cantidad de agua debe ser mayor que 0"],
    [2.5, "La cantidad de agua debe ser un número entero de mililitros"],
  ]) {
    test(`CA-05.2: una cantidad de ${cantidad} da su mensaje`, () => {
      assert.deepEqual(
        validarRiego({ ...riego, cantidadMl: cantidad }, ahora),
        [{ campo: "cantidadMl", mensaje }],
      );
    });
  }

  test("CA-05.3: la fecha de mañana es futura", () => {
    assert.deepEqual(validarRiego({ ...riego, fecha: "2026-11-19" }, ahora), [
      { campo: "fecha", mensaje: "Un riego no puede tener fecha futura" },
    ]);
  });

  test("CA-05.4: hoy a las 23:59 con ahora a las 00:01 no es futura", () => {
    const fecha = new Date(2026, 10, 18, 23, 59);
    assert.deepEqual(validarRiego({ ...riego, fecha }, ahora), []);
  });

  test('CA-05.5: planta "123" no tiene un identificador válido', () => {
    assert.deepEqual(validarRiego({ ...riego, planta: "123" }, ahora), [
      {
        campo: "planta",
        mensaje: "La planta no tiene un identificador válido",
      },
    ]);
  });

  test("sin datos, planta y cantidad son obligatorias", () => {
    assert.deepEqual(validarRiego(undefined, ahora), [
      { campo: "planta", mensaje: "La planta es obligatoria" },
      { campo: "cantidadMl", mensaje: "La cantidad de agua es obligatoria" },
    ]);
  });

  test("una fecha que no es fecha no es válida", () => {
    assert.deepEqual(validarRiego({ ...riego, fecha: "ayer" }, ahora), [
      { campo: "fecha", mensaje: "La fecha no es válida" },
    ]);
  });

  test("una cantidad en texto no es entera", () => {
    assert.deepEqual(validarRiego({ ...riego, cantidadMl: "500" }, ahora), [
      {
        campo: "cantidadMl",
        mensaje: "La cantidad de agua debe ser un número entero de mililitros",
      },
    ]);
  });
});
