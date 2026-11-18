# Tarjetas del tablero «Invernadero Encantado»

Archivo de carga para la skill `/tablero`. Cada tarjeta empieza con `## ` y una línea `Lista:`. En «Por hacer», el orden es la prioridad.

## Spec 04 · Validar la planta en el dominio
Lista: Por hacer

- **Historia:** HU-1.1 · Registrar una planta. **Deuda:** T-02 (backlog de E1, sección «Deuda técnica»).
- **Objetivo:** las reglas de una planta nueva se comprueban en una función pura de `src/dominio/`, que la ruta usa antes de tocar la base de datos.

### Reglas

- **DEBE** crear `src/dominio/validaciones.js` con `validarPlanta(datos)`, que devuelve una lista de `{ campo, mensaje }`, vacía si la planta es válida.
- **DEBE** usar los mismos mensajes que el modelo `Planta` y devolverlos en el orden nombre, especie, ubicación e intervalo.
- **DEBE** tratar como vacío un texto con solo espacios.
- **DEBE** aceptar como intervalo solo números enteros mayores o iguales a 1.
- **DEBE** hacer que `POST /api/plantas` responda 400 con `{ "error": "Datos no válidos", "detalles": [...] }` si `validarPlanta` devuelve algo, sin llamar a `Planta.create`.
- **NO DEBE** quitar las validaciones del modelo: siguen como segunda barrera.
- **NO DEBE** cambiar los mensajes ni tocar `client/`.

### Criterios de aceptación

- **CA-04.1:** DADO nombre, especie, ubicación e intervalo 3, CUANDO se valida, ENTONCES la lista está vacía.
- **CA-04.2:** DADO una planta sin especie y con intervalo 0, CUANDO se valida, ENTONCES hay dos detalles: «La especie es obligatoria» y «El intervalo de riego debe ser de al menos 1 día», en ese orden.
- **CA-04.3:** DADO un nombre con solo espacios, CUANDO se valida, ENTONCES aparece «El nombre es obligatorio».
- **CA-04.4:** DADO un intervalo de 2.5 o «tres», CUANDO se valida, ENTONCES aparece «El intervalo de riego debe ser un número entero de días».
- **CA-04.5:** DADO un cuerpo sin especie, CUANDO se envía a `POST /api/plantas`, ENTONCES responde 400 con el detalle y no se crea ninguna planta.

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-04.1 a CA-04.4 | Tests en `test/dominio/validaciones.test.js` |
| CA-04.5 | curl a la API y revisión del diff: la ruta llama a `validarPlanta` antes de `Planta.create` |

### Archivos

`src/dominio/validaciones.js` (nuevo) · `test/dominio/validaciones.test.js` (nuevo) · `src/routes/plantas.js`

## Spec 05 · Validar el riego en el dominio
Lista: Por hacer

- **Historia:** HU-1.2 · Registrar un riego. **Deuda:** T-05.
- **Objetivo:** las reglas de formato de un riego se comprueban en una función pura de `src/dominio/`, antes de buscar la planta en la base de datos.

### Reglas

- **DEBE** agregar a `src/dominio/validaciones.js` la función `validarRiego(datos, ahora)`, que devuelve una lista de `{ campo, mensaje }`.
- **DEBE** exigir `planta` con un identificador de 24 caracteres hexadecimales: «La planta es obligatoria» o «La planta no tiene un identificador válido».
- **DEBE** exigir `cantidadMl` entera y mayor que 0, con los mensajes del modelo `Riego`.
- **DEBE** aceptar `fecha` vacía (será hoy). Si viene, debe ser una fecha válida y no futura, usando `interpretarFecha` y `esFechaFutura` de `src/dominio/fechas.js`.
- **DEBE** hacer que `POST /api/riegos` responda 400 con el formato de error de la API si `validarRiego` devuelve algo, antes de buscar la planta.
- **NO DEBE** mover a esta función la regla de «no anterior al registro de la planta»: necesita la base de datos y sigue en la ruta.
- **NO DEBE** importar Mongoose en `src/dominio/`.

### Criterios de aceptación

- **CA-05.1:** DADO una planta válida y 500 ml sin fecha, CUANDO se valida, ENTONCES la lista está vacía.
- **CA-05.2:** DADO una cantidad de 0, -5 o 2.5, CUANDO se valida, ENTONCES aparece el mensaje de cantidad que corresponde.
- **CA-05.3:** DADO la fecha de mañana, CUANDO se valida, ENTONCES aparece «Un riego no puede tener fecha futura».
- **CA-05.4:** DADO hoy a las 23:59 con `ahora` a las 00:01 del mismo día, CUANDO se valida, ENTONCES no hay error de fecha.
- **CA-05.5:** DADO `planta: "123"`, CUANDO se valida, ENTONCES aparece «La planta no tiene un identificador válido».

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-05.1 a CA-05.5 | Tests en `test/dominio/validaciones.test.js`, con `ahora` fijo |
| Uso en la ruta | Revisión del diff: `validarRiego` va antes de `Planta.findById` |

### Archivos

`src/dominio/validaciones.js` · `test/dominio/validaciones.test.js` · `src/routes/riegos.js`

## Spec 06 · Consultar una planta por su identificador
Lista: Por hacer

- **Historia:** HU-1.4 · Historial de riegos (apoyo). Hoy el frontend recibe los datos de la planta desde la lista; con este endpoint, el detalle puede pedirlos solo.
- **Objetivo:** `GET /api/plantas/:id` devuelve una planta, con los mismos errores que el historial de riegos.

### Reglas

- **DEBE** agregar `esIdValido(valor)` a `src/dominio/validaciones.js`: verdadero solo para 24 caracteres hexadecimales.
- **DEBE** crear `GET /api/plantas/:id`: 400 con `{ campo: "id", mensaje: "La planta no tiene un identificador válido" }` si el id no es válido, 404 con `{ "error": "Planta no encontrada" }` si no existe y 200 con la planta si existe.
- **DEBE** usar `esIdValido` también en `GET /api/plantas/:id/riegos`, en lugar de la comprobación actual.
- **NO DEBE** cambiar el frontend en esta spec.

### Criterios de aceptación

- **CA-06.1:** DADO `"665f1c2a9b1e8a0012345678"`, CUANDO se comprueba, ENTONCES `esIdValido` es verdadero; con `"123"`, `""` o `null`, falso.
- **CA-06.2:** DADO una planta registrada, CUANDO se pide por su id, ENTONCES responde 200 con sus datos.
- **CA-06.3:** DADO un id con formato válido que no existe, CUANDO se pide, ENTONCES responde 404.
- **CA-06.4:** DADO el id `abc`, CUANDO se pide la planta o su historial, ENTONCES los dos responden 400 con el mismo detalle.

### Verificación

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-06.1 | Tests en `test/dominio/validaciones.test.js` |
| CA-06.2 a CA-06.4 | curl a la API |

### Archivos

`src/dominio/validaciones.js` · `test/dominio/validaciones.test.js` · `src/routes/plantas.js`

## HU-2.1 · Ver las plantas que necesitan agua
Lista: Backlog

Como cuidador, quiero ver qué plantas necesitan agua hoy, para regarlas sin revisar el historial de cada una.

- **Alcance:** PRD §4.3, épica E2.
- **Estado:** sin spec. Falta definir la regla de «sedienta» con el cliente y escribir sus criterios. **No se implementa hasta tener spec.**

## HU-2.2 · Poner una planta en reposo
Lista: Backlog

Como cuidador, quiero marcar una planta en reposo, para que no aparezca como sedienta mientras no necesita riego.

- **Alcance:** épica E2.
- **Estado:** sin spec. El PRD todavía no define qué es el reposo ni cuánto dura (pregunta abierta). **No se implementa hasta tener spec.**

## Spec 01 · Registrar plantas y riegos
Lista: Hecho

Backend de la épica E1. Ver `docs/specs/01-plantas-y-riegos.md`.

## Spec 02 · Frontend de la épica E1
Lista: Hecho

Pantallas «Plantas» y «Detalle de planta». Ver `docs/specs/02-frontend-e1.md` y `docs/AUDITORIA-frontend.md`.

## Spec 07 · Registrar un riego rápido desde la lista
Lista: Por hacer

- **Historia:** HU-1.8 · Registrar un riego rápido desde la lista (backlog de E1).
- **Objetivo:** el cuidador anota un riego de hoy desde la lista de plantas, en un panel dentro de la fila, sin abrir el detalle.

### Reglas

- **DEBE** añadir un botón secundario «Regar» a cada planta de la lista: al pie de la tarjeta en móvil y en una columna sin título, a la derecha, en escritorio.
- **DEBE** abrir, al pulsar «Regar», un panel dentro de esa fila que sustituye al botón, con el campo «Cantidad (ml)» relleno con 500, el texto «Fecha: hoy» y los botones «Guardar riego» y «Cancelar». No pide cuidador ni fecha.
- **DEBE** mantener un solo panel abierto: abrir otro, o pulsar «Cancelar», cierra el anterior sin guardar.
- **DEBE** registrar el riego con `registrarRiego` de `client/src/api.js` (`POST /api/riegos`), enviando la planta y la cantidad, sin fecha ni cuidador, como hace el detalle cuando se dejan vacíos.
- **DEBE** mostrar los errores de validación de la API junto al campo con `repartirErrores`, y cualquier otro error como mensaje arriba del panel, con los textos y el tono de `DESIGN.md`.
- **DEBE** dejar «Guardar riego» como botón secundario: `DESIGN.md` permite un solo primario por pantalla y ese es «Registrar planta». Los wireframes lo dibujan relleno; manda `DESIGN.md`.
- **DEBE** usar solo componentes existentes (`Campo`, `Mensaje`, iconos de `Iconos.jsx`) y variables de `tokens.css`.
- **NO DEBE** cambiar el backend ni `client/src/api.js`.
- **NO DEBE** cambiar el formulario «Registrar una planta» ni la pantalla de detalle.
- **NO DEBE** guardar «Regada hoy» en ningún sitio: es estado de la pantalla y desaparece al recargar.

### Criterios de aceptación

- **CA-07.1 (CA-1.8.1):** DADO la lista con «Helecho Lunar», CUANDO el cuidador pulsa «Regar» en su fila, ENTONCES se abre el panel con «Cantidad (ml)» = 500, «Fecha: hoy», «Guardar riego» y «Cancelar», el foco pasa al campo y no se pide cuidador.
- **CA-07.2 (CA-1.8.2):** DADO el panel abierto en «Helecho Lunar», CUANDO el cuidador pulsa «Regar» en «Mandrágora», ENTONCES el primer panel se cierra sin guardar y se abre el segundo con 500 ml. «Cancelar» cierra el panel sin registrar ningún riego.
- **CA-07.3 (CA-1.8.3):** DADO el panel con 500 ml, CUANDO el cuidador pulsa «Guardar riego» y la API no ha respondido, ENTONCES el botón dice «Guardando…» y quedan desactivados el botón, el campo y «Cancelar». Un doble toque registra un solo riego.
- **CA-07.4 (CA-1.8.4):** DADO el panel con 500 ml, CUANDO la API acepta el riego, ENTONCES el panel se cierra, debajo de «Regar» aparece «Riego guardado para Helecho Lunar.» y la fila muestra «Regada hoy» hasta recargar. En el detalle, el historial muestra primero ese riego: fecha de hoy, 500 ml y «sin cuidador».
- **CA-07.5 (CA-1.8.5):** DADO el panel abierto, CUANDO el cuidador guarda con 0, con el campo vacío o con 2,5, ENTONCES el panel sigue abierto con lo escrito y el campo muestra el mensaje de la API que corresponde, con icono. No aparece «Regada hoy» ni se registra ningún riego.
- **CA-07.6 (CA-1.8.6):** DADO el panel con 500 ml, CUANDO la API no responde o falla, ENTONCES el panel sigue abierto con los 500 ml, arriba del panel aparece «No pudimos guardar el riego. Revisa la conexión y vuelve a intentarlo.» con icono, y «Guardar riego» vuelve a estar activo. No aparece «Regada hoy».
- **CA-07.7 (CA-1.8.7):** DADO la lista a 390 px de ancho, CUANDO el cuidador abre el panel en una tarjeta, ENTONCES el panel queda dentro de la tarjeta sin desplazamiento horizontal, el teclado es numérico, los botones ocupan todo el ancho con al menos 44 px de alto y los mensajes se leen dentro de la tarjeta.

### Pantallas

La **estructura** (qué hay en cada pantalla, en qué orden y con qué textos) sale del wireframe; el **estilo** (colores, tipografía y componentes), de `DESIGN.md`; el **comportamiento**, de los criterios de esta spec.

| Estado | Wireframe | Criterios |
| --- | --- | --- |
| Lista | `docs/specs/07-riego-rapido/wireframes/lista-movil.svg` · `docs/specs/07-riego-rapido/wireframes/lista-escritorio.svg` | CA-07.1, CA-07.7 |
| Panel abierto | `docs/specs/07-riego-rapido/wireframes/panel-abierto-movil.svg` · `docs/specs/07-riego-rapido/wireframes/panel-abierto-escritorio.svg` | CA-07.1, CA-07.2, CA-07.7 |
| Guardando | `docs/specs/07-riego-rapido/wireframes/guardando-movil.svg` | CA-07.3 |
| Éxito | `docs/specs/07-riego-rapido/wireframes/exito-movil.svg` | CA-07.4 |
| Historial tras el riego | `docs/specs/07-riego-rapido/wireframes/historial-tras-riego-movil.svg` | CA-07.4 |
| Error de validación | `docs/specs/07-riego-rapido/wireframes/error-validacion-movil.svg` | CA-07.5 |
| Error de conexión | `docs/specs/07-riego-rapido/wireframes/error-conexion-movil.svg` | CA-07.6 |

Las decisiones de diseño están en `docs/specs/07-riego-rapido/wireframes/README.md`.

### Verificación

El frontend no tiene tests automáticos, como en la spec 02: los criterios se comprueban en el navegador, con la API y el cliente en marcha.

| Criterio | Cómo se comprueba |
| --- | --- |
| CA-07.1 a CA-07.6 | Captura a 390 px y a 1280 px de cada estado (`npm run captura`, en `capturas/`), comparada con su wireframe, y prueba en el navegador |
| CA-07.3 | Doble clic en «Guardar riego» y revisión del historial: un solo riego nuevo |
| CA-07.6 | API parada o petición bloqueada en el navegador |
| CA-07.7 | Capturas a 390 px y teclado numérico en el móvil o en la emulación del navegador |
| Backend | `npm test` sigue pasando y el diff no toca `src/` ni `client/src/api.js` |

### Archivos

`client/src/pantallas/Plantas.jsx` · `client/src/componentes/PanelRiego.jsx` (nuevo) · `client/src/styles/app.css`
