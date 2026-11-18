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

### Pendientes

Diferencias que quedan entre las capturas (`docs/specs/07-riego-rapido/capturas/`) y los wireframes, y temas fuera de alcance:

- **Escritorio, panel abierto:** el wireframe dibuja «Regar» visible encima del panel; la implementación lo oculta, porque la regla de esta spec dice que el panel sustituye al botón.
- **«Guardar riego» es secundario**, no relleno como en los wireframes: lo decide la regla de esta spec, siguiendo `DESIGN.md`.
- **Guardando:** los botones secundarios desactivados se ven igual que los activos (solo cambia el texto a «Guardando…» y el cursor). `DESIGN.md` no define un estilo de botón desactivado; el wireframe los dibuja en gris. Hay que decidirlo en `DESIGN.md`.
- **Orden de las plantas:** las capturas usan los datos de desarrollo (Mandrágora, Ruda, Helecho Lunar), no el orden del wireframe. No es una diferencia de estructura.
- **`.gitignore`:** la regla `capturas/` ignora también `docs/specs/*/capturas/`; las capturas de esta spec se añadieron con `git add -f`. Si solo se quiere ignorar la carpeta de la raíz, la regla debería ser `/capturas/`.
