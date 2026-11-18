const { describe, test } = require("node:test");
const assert = require("node:assert/strict");
const { validarPlanta } = require("../../src/dominio/validaciones");

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
