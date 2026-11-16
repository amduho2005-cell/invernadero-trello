# Diagnóstico de diseño del frontend (E1)

Fecha: 9 nov 2026. Rama `feature/pulido-frontend`.

## Línea base de `impeccable detect`

Ejecutado sobre el commit `3a3cddd`, con la API y el cliente en marcha. Se usó el lanzador del proyecto (`.claude/skills/impeccable/scripts/impeccable detect`), que es la misma herramienta que `npx impeccable`.

| Objetivo | Hallazgos | Nota |
|---|---|---|
| `client/src` | **0** | 12 archivos (.css, .js, .jsx) revisados solo como texto. Las reglas que necesitan la página renderizada (contraste, texto pequeño) no corren sobre el código fuente. |
| `http://localhost:5173` | **0** | Página renderizada en navegador a 1280×800: se ejecutan todas las reglas. |

`detect` no aporta filas a la tabla.

## Hallazgos

Origen:
- **critique:** `/impeccable critique client/src/pantallas`, nota 24/40.
- **audit:** `/impeccable audit client/src/pantallas`, nota 17/20.

Las dos revisiones se hicieron sobre el código anterior a `3a3cddd`. Cuando las dos encontraron lo mismo, se indican ambos orígenes en una sola fila.

| Id | Hallazgo | Pantalla | Origen | Regla de DESIGN.md o criterio de la spec 02 | Decisión |
|---|---|---|---|---|---|
| H-1 | El formulario «Registrar un riego» va debajo del historial y queda más lejos con cada riego | Detalle de planta | critique, audit | DESIGN.md · Principio 1 «Lo importante primero»; spec §1.2 Contenido | — (resuelto en `3a3cddd`) |
| H-2 | Si la carga falló y luego se guarda, la lista o el historial pasan a mostrar solo el elemento nuevo, como si estuvieran completos | Ambas | critique | DESIGN.md · Principio 3 «Cada estado tiene su mensaje»; spec CA-F.3 y CA-F.7 | — (resuelto en `3a3cddd`) |
| H-3 | Al cambiar de pantalla el foco se pierde (cae al `body`) y el lector no anuncia la pantalla nueva | Ambas (navegación) | critique, audit | — (WCAG 2.4.3; DESIGN.md no tiene regla de gestión del foco) | — (resuelto en `3a3cddd`) |
| H-4 | El botón Atrás del navegador sale de la app y recargar en la ficha vuelve a la lista | Ambas (navegación) | critique, audit | Spec §1 «sin librería de rutas» (condiciona la solución) | — (resuelto en `3a3cddd`) |
| H-5 | La ficha se abre con el desplazamiento de la lista, a media página | Detalle de planta | critique | — | — (resuelto en `3a3cddd`) |
| H-6 | Tras un error de validación, el foco se queda en el botón y el lector no anuncia el error del campo | Ambas (formularios) | critique, audit | DESIGN.md · Principio 4 y Componente «Campo»; spec §1.3, CA-F.4 y CA-F.8 | — (resuelto en `3a3cddd`) |
| H-7 | La región `role="status"` del mensaje de éxito se crea ya con el texto, así que puede no anunciarse | Ambas (formularios) | audit | DESIGN.md · Componente «Mensaje de éxito»; spec CA-F.3 y CA-F.7 | — (resuelto en `3a3cddd`) |
| H-8 | El error de conexión dice «vuelve a intentarlo», pero no hay botón para reintentar; hay que recargar | Ambas | critique, audit | DESIGN.md · Principio 4 «Cada error dice qué pasó y cómo arreglarlo»; spec CA-F.9 | — (resuelto en `3a3cddd`) |
| H-9 | «Revisa que la API esté encendida»: jerga técnica para un cuidador voluntario | Ambas | critique | DESIGN.md · Tono de voz (sin tecnicismos); spec §1.1 y §1.2 (fila «Error de conexión»), CA-F.9 | — (resuelto en `3a3cddd`) |
| H-10 | En el móvil, el mensaje de éxito sale encima de los campos y queda fuera de la vista tras pulsar el botón | Ambas (formularios) | critique | DESIGN.md · Componente «Mensaje de éxito»; spec CA-F.3 y CA-F.7 | — (resuelto en `3a3cddd`) |
| H-11 | El mensaje de éxito sigue visible mientras se escribe el siguiente registro | Ambas (formularios) | critique | — | — (resuelto en `3a3cddd`) |
| H-12 | El campo Fecha no tiene `min`: se puede elegir un día anterior al registro y el error solo llega desde la API | Detalle de planta | critique | Spec §1.2 (campo Fecha) y CA-F.8; regla 6.4 del PRD | — (resuelto en `3a3cddd`) |
| H-13 | En el móvil, `display: block` sobre la tabla le quita la semántica de tabla en Safari/VoiceOver | Plantas | critique, audit | DESIGN.md · Componente «Lista de plantas»; spec §1.1 Lista y CA-F.11 | — (resuelto en `3a3cddd`) |
| H-14 | `border-collapse: collapse` impide el `border-radius`: la tabla tiene esquinas cuadradas en escritorio | Plantas | critique, audit | DESIGN.md · Espacio y forma (`--radio-tarjeta`) | — (resuelto en `3a3cddd`) |
| H-15 | En el móvil, el botón primario se alinea a la izquierda y no ocupa todo el ancho (es difícil de pulsar con el pulgar) | Ambas (formularios) | critique | DESIGN.md · Componente «Botón primario»; spec CA-F.11 | — (resuelto en `3a3cddd`) |
| H-16 | Los campos obligatorios no llevan `required` ni `aria-required` | Ambas (formularios) | audit | — (regla 6.8 del PRD) | — (resuelto en `3a3cddd`) |
| H-17 | El estado 404 no tiene `<h1>` | Detalle de planta | critique | Spec §1.2 (fila «Planta inexistente (404)») | — (resuelto en `3a3cddd`) |
| H-18 | El glifo «←» del enlace de volver se lee como «flecha izquierda» | Detalle de planta | critique | DESIGN.md · No hacemos («Iconos… solo SVG en línea») | entra |
| H-19 | `--color-superficie` se usa como color de texto blanco en el botón primario y el encabezado de la tabla | Ambas | critique, audit | DESIGN.md · Color (`--color-superficie`: «Tarjetas y formularios») | se difiere |
| H-20 | Valores fijos fuera de los tokens: icono de 18 px y ancho máximo de 960 px | Ambas | critique | DESIGN.md · Tokens en CSS; spec CA-F.10 | se difiere |
| H-21 | Hay que escribir «Cuidador» en cada riego; no se recuerda el último | Detalle de planta | critique | DESIGN.md · Concepto («anotar algo en segundos») | se difiere |
| H-22 | La lista no muestra cuándo se regó cada planta ni deja buscar; para saberlo hay que abrir cada ficha | Plantas | critique | — (consulta de plantas sedientas: épica E2, fuera de la spec 02 §4) | se difiere |
| H-23 | El formulario de alta siempre está desplegado y pesa tanto como la lista, aunque registrar plantas es raro | Plantas | critique | DESIGN.md · Principio 1 «Lo importante primero» | se difiere |
| H-24 | En la tarjeta del móvil solo el nombre es tocable, no la tarjeta entera | Plantas | critique | — | se difiere |
| H-25 | Nada indica que el nombre de la planta abre su ficha | Plantas | critique | Spec §1.1 Lista («el nombre… es un enlace») | se difiere |
| H-26 | La marca de la cabecera no enlaza al inicio; desde la ficha solo se vuelve con el enlace pequeño | Ambas (cabecera) | critique | — | se difiere |
| H-27 | El texto «Cargando…» no está en una región viva: el paso de cargando a cargado es silencioso | Ambas | critique | DESIGN.md · Componente «Mensaje de carga»; Principio 3 | entra |
| H-28 | Los mensajes de error generales usan su propio texto como `key`; dos iguales chocarían | Ambas (formularios) | critique | — | se difiere |
| H-29 | Las fuentes se cargan desde Google Fonts, una hoja externa que bloquea el primer pintado | Ambas | audit | DESIGN.md · Tipografía (fuentes de Google Fonts); spec §3 (`client/index.html`) | se difiere |

## Decisiones

Valores de la columna «Decisión»:
- **entra:** viola DESIGN.md, la accesibilidad o un criterio de la spec 02. Máximo 5.
- **se difiere:** es una mejora real, pero no cabe hoy.
- **se rechaza:** contradice «No hacemos» de DESIGN.md o la regla de skills de AGENTS.md.

H-1 a H-17 ya están resueltos, así que no llevan decisión y no cuentan para el máximo.

**Entran (2):**
- **H-18:** DESIGN.md («No hacemos») pide iconos solo en SVG en línea, y «←» es un glifo.
- **H-27:** WCAG 4.1.3: el cambio de estado de la carga debe anunciarse.

**Se difieren:** H-19 a H-26, H-28 y H-29.
- No incumplen ninguna regla: H-19 y H-20 usan variables o valores que DESIGN.md no define como tokens, y H-29 sigue lo que piden DESIGN.md y la spec (§3).
- H-22 pertenece a la épica E2.

**Se rechazan:** ninguno. Ningún hallazgo abierto pide animaciones, sombras, degradados, modo oscuro, imágenes, emojis, librerías de UI o de iconos, ni los comandos `animate`, `delight`, `overdrive` o `bolder`.

## Estado tras el commit `3a3cddd`

- **Resueltos:** H-1 a H-17.
- **Resuelto en parte:** H-18. El «←» ya no se lee (`aria-hidden`), pero sigue siendo un glifo y no un SVG.
- **Abiertos:** H-19 a H-29. H-22 pertenece a E2.

Estos estados salen del commit y de las comprobaciones en el navegador. No se ha vuelto a lanzar `critique` ni `audit` para confirmarlos. Dos casos siguen sin probar en el navegador: el reintento con la API parada (H-8) y el mensaje de éxito tras guardar de verdad (H-7 y H-10).
