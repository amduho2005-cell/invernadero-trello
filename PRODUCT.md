# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Cuidadores voluntarios** de un único invernadero. Registran plantas y riegos de pie, entre las mesas, casi siempre desde el móvil, y necesitan encontrar o anotar algo en segundos. Todos ven todas las plantas; no hay cuentas ni roles.

Es un proyecto de curso (DW3) con un invernadero ficticio: no hay usuarios reales ni datos de uso.

## Product Purpose

Sustituir la memoria y las notas sueltas por un registro fiable de riegos, para que ninguna planta se quede sin agua ni se riegue de más.

Éxito: que el cuidador sepa en una sola consulta qué plantas regar hoy y cuáles van más atrasadas. Métrica orientativa del PRD: ≥ 90 % de plantas regadas en su día o antes durante el primer mes.

## Positioning

Un cuaderno de riegos con una sola respuesta que importa: qué toca regar hoy, ordenado por retraso. Lo «mágico» del nombre es solo ambientación (nombres de plantas, un toque en los textos); el producto no modela propiedades mágicas.

## Operating Context

- Uso en el invernadero, de pie, con una mano, en el móvil; a veces en escritorio.
- Se anotan riegos en el momento o después, incluido un riego olvidado con fecha pasada.
- Frontend React + Vite en `client/`, que llama a la API Express/MongoDB por `/api/...`.

## Capabilities and Constraints

Alcance del MVP (fijo, `docs/prd/invernadero-mvp.md` §4):

- **E1 (hecho):** registrar planta (nombre, especie, ubicación, «Riego cada (días)»), registrar riego (cantidad en ml enteros > 0, fecha, cuidador opcional), ver lista de plantas e historial de riegos.
- **E2 (pendiente):** consulta de plantas que necesitan agua, con días de retraso, de la más a la menos urgente.

Fuera de alcance: cuentas y permisos, notificaciones, varios invernaderos, sensores, editar o borrar riegos.

Las reglas de negocio del PRD (§6) son fijas: intervalo entero ≥ 1 día; un riego no puede ser futuro ni anterior al registro de la planta; días de calendario, sin hora; cuenta el riego más reciente.

Sin decidir (no inventar): corrección de riegos erróneos, desempate con igual retraso, máximo de agua por riego, especie/ubicación como texto libre o lista, cambio de intervalo, qué es el «reposo» de E2.

Ninguna funcionalidad se implementa sin spec en `docs/specs/`.

## Brand Commitments

- Nombre: **Invernadero Encantado**.
- Voz (`DESIGN.md`, fija): español, tuteo, frases cortas, sin tecnicismos («400», «ObjectId», «payload»). Cada error dice qué pasó y cómo arreglarlo. Los mensajes de éxito nombran lo que se guardó, sin exclamaciones ni emojis.

## Evidence on Hand

No hay datos reales, testimonios ni métricas. No inventarlos. Las plantas de ejemplo (p. ej. «Helecho Lunar») son ficticias.

## Product Principles

1. Lo importante primero: qué planta es y cuándo se regó.
2. Anotar un riego debe costar segundos, en el móvil y de pie.
3. Cada estado tiene su mensaje: cargando, vacío, error y éxito.
4. La magia es ambientación, nunca un obstáculo para la claridad.
5. No se amplía el alcance sin pasar por el PRD y una spec.

## Accessibility & Inclusion

Fijo, nivel WCAG AA: contraste de texto ≥ 4.5:1, zonas táctiles ≥ 44 px, `<label>` real en cada campo, errores con icono y texto (nunca solo color), foco visible y elementos nativos (`<button>`, `<a href>`).
