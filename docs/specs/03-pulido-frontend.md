# Spec 03 · Pulido del frontend de E1

- **Origen:** los hallazgos con decisión «entra» de [docs/diagnostico-diseno.md](../diagnostico-diseno.md): H-18 y H-27.
- **Parte de:** la [spec 02](02-frontend-e1.md). Todos sus criterios siguen vigentes.
- **Diseño:** [DESIGN.md](../../DESIGN.md).
- **Estado:** implementada.

## 1. Cambios

### 1.1 Icono de «Volver a plantas» (H-18)

El enlace «Volver a plantas» del «Detalle de planta» usa hoy el carácter «←». Se sustituye por un icono SVG en línea, en `client/src/componentes/Iconos.jsx`, con el mismo trazo que `IconoError` e `IconoVisto`. Lleva `aria-hidden="true"` y toma el color del enlace (`currentColor`).

### 1.2 Estados de carga anunciados (H-27)

- «Cargando plantas…» y «Cargando riegos…» se muestran dentro de una región `role="status"` que existe desde que se monta la pantalla. Así, el lector de pantalla anuncia que empieza la carga.
- Al pulsar «Volver a intentarlo», el botón desaparece mientras se carga. Para que el foco no se pierda, pasa a un título visible: «Plantas» (el `<h1>`, porque el título de la lista solo existe para lectores de pantalla) o «Historial de riegos» en el detalle.

## 2. Criterios de aceptación

- **CA-P.1 · Icono SVG al volver** (H-18): DADO el «Detalle de planta», CUANDO se inspecciona el enlace «Volver a plantas», ENTONCES DEBE contener un icono `<svg>` en línea con `aria-hidden="true"`, y su texto NO DEBE incluir el carácter «←».
- **CA-P.2 · El lector no lee la flecha** (H-18): DADO el «Detalle de planta» con un lector de pantalla, CUANDO el foco llega a «Volver a plantas», ENTONCES DEBE anunciarse «Volver a plantas, enlace», y NO DEBE anunciarse «flecha».
- **CA-P.3 · Icono coherente** (H-18): DADO el enlace «Volver a plantas» a 390 px de ancho, CUANDO se mide, ENTONCES DEBE medir al menos 44 px de alto; el icono DEBE ser del mismo tamaño (18 px) y color que el resto del enlace; y NO DEBE usarse ninguna librería de iconos.
- **CA-P.4 · Carga anunciada** (H-27): DADO una pantalla («Plantas» o «Detalle de planta») recién abierta, CUANDO empieza la carga, ENTONCES el texto «Cargando…» DEBE estar dentro de una región `role="status"` presente en el DOM desde el montaje, y NO DEBE crearse esa región junto con su texto.
- **CA-P.5 · Reintento sin perder el foco** (H-27): DADO el error de conexión con el botón «Volver a intentarlo», CUANDO el cuidador lo pulsa con el teclado, ENTONCES el foco DEBE pasar al título visible de lo que se está cargando («Plantas» o «Historial de riegos»), NO DEBE quedarse en el `body`, y DEBE anunciarse «Cargando…».

## 3. Verificación e implementación

| Criterio | Cómo se verifica | Comando de Impeccable |
|---|---|---|
| CA-P.1 | Revisión contra DESIGN.md («No hacemos»: solo SVG en línea) y `detect` sobre `http://localhost:5173` | `/impeccable polish` |
| CA-P.2 | `audit` y navegador a 390 px, comprobando el árbol de accesibilidad | `/impeccable polish` |
| CA-P.3 | Navegador a 390 px y revisión contra DESIGN.md (44 px, sin librerías de iconos) | `/impeccable polish` |
| CA-P.4 | `audit` y navegador a 390 px, comprobando que la región existe antes de la carga | `/impeccable harden` |
| CA-P.5 | Navegador a 390 px con la API detenida y luego arrancada, usando solo el teclado | `/impeccable harden` |

Al terminar, `detect` sobre `client/src` y sobre `http://localhost:5173` DEBE seguir dando 0 hallazgos, y `npm test` DEBE pasar.

## 4. Archivos

| Archivo | Qué cambia |
|---|---|
| `client/src/componentes/Iconos.jsx` | Nuevo icono de flecha para volver |
| `client/src/pantallas/DetallePlanta.jsx` | Enlace «Volver a plantas» con el icono; región de carga y foco tras reintentar |
| `client/src/pantallas/Plantas.jsx` | Región de carga y foco tras reintentar |
| `client/src/styles/app.css` | Solo si el icono del enlace lo necesita, y solo con tokens |

## 5. No-alcance

- NO DEBEN usarse los comandos `animate`, `delight`, `overdrive` ni `bolder` (regla de skills de AGENTS.md).
- NO DEBEN añadirse fuentes, colores, sombras, degradados, animaciones ni otros efectos fuera de DESIGN.md.
- NO DEBE cambiarse el backend.
- NO DEBE dejar de cumplirse ningún criterio de la spec 02 (CA-F.1 a CA-F.12).
- Los hallazgos con decisión «se difiere» (H-19 a H-26, H-28 y H-29) quedan fuera de esta spec.
