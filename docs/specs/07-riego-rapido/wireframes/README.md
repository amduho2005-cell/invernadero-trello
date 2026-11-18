# Wireframes · HU-1.8 · Registrar un riego rápido desde la lista

Historia y criterios: [docs/backlog/E1-plantas-y-riegos.md](../../../backlog/E1-plantas-y-riegos.md#hu-18--registrar-un-riego-rápido-desde-la-lista).

Son wireframes en grises: deciden la estructura y los textos, no el aspecto. Colores, fuentes y espacios salen de `DESIGN.md` al implementar.

| Estado | Archivos | Criterios |
| --- | --- | --- |
| Lista | [lista-movil.svg](lista-movil.svg), [lista-escritorio.svg](lista-escritorio.svg) | CA-1.8.1 (punto de partida), CA-1.8.7 |
| Panel abierto | [panel-abierto-movil.svg](panel-abierto-movil.svg), [panel-abierto-escritorio.svg](panel-abierto-escritorio.svg) | CA-1.8.1, CA-1.8.2, CA-1.8.7 |
| Guardando | [guardando-movil.svg](guardando-movil.svg) | CA-1.8.3, CA-1.8.7 |
| Éxito | [exito-movil.svg](exito-movil.svg) | CA-1.8.4, CA-1.8.7 |
| Historial tras el riego | [historial-tras-riego-movil.svg](historial-tras-riego-movil.svg) | CA-1.8.4, CA-1.8.7 |
| Error de validación | [error-validacion-movil.svg](error-validacion-movil.svg) | CA-1.8.5, CA-1.8.7 |
| Error de conexión | [error-conexion-movil.svg](error-conexion-movil.svg) | CA-1.8.6, CA-1.8.7 |

## Decisiones

Lo que estos wireframes deciden y los criterios no dicen:

1. **Dónde va «Regar».** En móvil, como botón secundario a todo el ancho, al pie de cada tarjeta, debajo de los datos. En escritorio, en una columna nueva a la derecha de la tabla, sin título visible.
2. **El panel sustituye a «Regar».** Mientras el panel está abierto, el botón «Regar» de esa fila no se ve: el panel ocupa su sitio. Al cerrarse, vuelve el botón.
3. **El panel va dentro de la fila.** En móvil, dentro de la tarjeta y debajo de los datos, con fondo gris claro. En escritorio, como una franja a todo el ancho de la tabla justo debajo de la fila, con los controles en una línea.
4. **Orden dentro del panel:** «Cantidad (ml)», «Fecha: hoy», «Guardar riego» y «Cancelar». En móvil, los botones van uno debajo del otro. En escritorio van a la derecha, en la misma línea que el campo.
5. **«Guardar riego» es el botón primario del panel, y «Regar» es secundario.** DESIGN.md pide un solo primario por pantalla, y «Registrar planta» ya lo es. Los wireframes tratan el panel como una zona propia; **la spec tiene que confirmarlo** o pasar «Guardar riego» a secundario.
6. **Mientras se guarda, «Cancelar» también se desactiva.** Así no hay dudas de si un riego cancelado a medias se guardó o no. CA-1.8.3 solo pide desactivar el botón y el campo.
7. **El mensaje de éxito va dentro de la tarjeta, debajo de «Regar»**, como pide DESIGN.md (debajo del botón que lo provocó). «Regada hoy» es una etiqueta a la derecha del nombre de la planta.
8. **El error de validación sigue el patrón de los formularios:** el borde del campo pasa a 2 px y debajo aparece el mensaje con icono.
9. **El error de conexión va arriba del panel, dentro de la tarjeta.** La primera línea, en negrita, dice qué pasó; las siguientes, qué hacer. No hay botón «Volver a intentarlo»: para reintentar, se vuelve a pulsar «Guardar riego».
10. **En el detalle, el riego nuevo no se marca de ninguna forma.** El recuadro discontinuo y el texto «riego nuevo» del wireframe son anotaciones para quien revisa, no parte de la interfaz.
11. **Escritorio solo tiene dos estados** (lista y panel abierto). Los demás estados son iguales que en móvil, pero dentro de la franja del panel.

## Cobertura

Cada criterio, de CA-1.8.1 a CA-1.8.7, aparece en al menos un wireframe. Lo que un dibujo estático no puede mostrar:

- **CA-1.8.2:** que el panel anterior se cierre al abrir otro. Se ve solo como resultado: en el panel abierto, las demás filas siguen cerradas. «Cancelar» lleva de vuelta al estado «Lista».
- **CA-1.8.3:** que un doble toque no cree dos riegos. Es comportamiento; se comprueba en la spec y en los tests.
- **CA-1.8.1:** que el foco pase al campo de cantidad.
- **CA-1.8.7:** que se abra el teclado numérico.
