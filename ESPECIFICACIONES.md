# ESPECIFICACIONES — Web de Binalis

Documento vivo (_Spec_ del flujo SDD). Todo cambio de alcance se registra aquí antes de implementarse.

## 1. Objetivo

Presentar Binalis, mostrar los proyectos realizados con su proceso de trabajo y captar consultas de cotización.

## 2. Público e idioma

Primero mercado local (Paraguay); a futuro, posiblemente el exterior. Idioma: **español** por ahora.

La web tiene que reflejar la **identidad del dueño como programador**: estética de código (JetBrains Mono en etiquetas y detalles técnicos) y una persona real detrás de la marca (RF-10).

## 3. Alcance v1

| ID    | Requisito                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-01 | Barra superior fija al bajar, con wordmark, anclas a Servicios, Proceso y Proyectos, link a "Quién soy" (baja a "Quién está detrás"; su botón "Conocé mi historia" lleva a `/quien-soy/`) y botón "Cotizá tu proyecto". En celular, una sola fila: wordmark, botón y un menú desplegable con los links.                                                                                                         |
| RF-02 | Portada con titular, subtítulo, botones "Cotizá tu proyecto" y "Ver proyectos", y el símbolo "b" con glow neón que pulsa (salvo con movimiento reducido). Fondo con brillo de marca y el campo binario (RF-12); sin JavaScript, una grilla tenue. Al cargar, la "b" se dibuja (la barra es un 1 y el aro un 0) y una línea en estilo código cuenta ese origen del nombre.                                       |
| RF-03 | Servicios (3 tarjetas): Páginas web · Sistemas y apps a medida · Landing pages y promociones. Debajo, "¿Tu idea no entra en ninguna? Contame y lo vemos juntos." con link a la cotización.                                                                                                                                                                                                                      |
| RF-04 | Proceso de trabajo en 4 pasos: Conversamos · Diseñamos · Construimos · Entregamos y acompañamos. La línea de marca sobre cada paso se llena al bajar (en fila, de 01 a 04).                                                                                                                                                                                                                                     |
| RF-05 | Proyectos: por cada uno, etiquetas, nombre, descripción, medio (video corto o capturas) y bloques Problema / Solución / Resultado. Las capturas van en un marco de navegador; si el proyecto es público, link "Ver sitio en vivo".                                                                                                                                                                              |
| RF-06 | Bloque final de proyectos "siguiente proyecto cargando…" con el nombre del proyecto en curso (hoy: CRM con inteligencia artificial), su stack (el del sistema de Cosmos Trak: React y PostgreSQL), barra y porcentaje que avanzan al bajar, y "¿Querés uno para tu empresa? Hablemos" con link a la cotización.                                                                                                 |
| RF-07 | Testimonios "Lo que dicen mis clientes": hasta 3, solo reales y con autorización del cliente, que aprueba el texto exacto. Cada uno con su frase de recomendación destacada, el resto de su opinión, nombre, cargo y calificación. Va después de Proyectos.                                                                                                                                                     |
| RF-08 | Cotización (`#cotizacion`): qué pasa después de escribir y un botón de WhatsApp por necesidad ("Necesito una página", "Necesito un sistema", "Necesito una promo"), cada uno con su mensaje ya escrito, más correo (`mailto:` con asunto y plantilla) y la dirección de correo visible. El número de WhatsApp no aparece escrito en el sitio. El formulario con envío serverless queda para v2 (ver sección 7). |
| RF-09 | Pie con el versículo de Binalis (Mateo 11:28, RVR1960), WhatsApp, correo y redes (cada uno cuando exista), © año y versión del sitio.                                                                                                                                                                                                                                                                           |
| RF-11 | Página 404 propia con la marca en 8 bits (la "b" y el "404" pixelados) y links a la portada y a la cotización.                                                                                                                                                                                                                                                                                                  |
| RF-10 | "Quién está detrás": en la portada, una tarjeta (foto, cargo, nombre, tarjeta de código y "Conocé mi historia"); en `/quien-soy/`, la historia completa del Ing. Marthin Meza. Texto aprobado por él.                                                                                                                                                                                                           |
| RF-12 | Campo binario en la portada: una grilla de 1 y 0 en canvas 2D, con los colores de marca, que se mueve sola y se apaga cerca del texto para no bajar su contraste. El puntero enciende los bits cercanos; un clic o toque fuera de links y botones lanza una onda con la forma de la "b". Es decorativo: no recibe foco, no intercepta clics y los lectores de pantalla no lo anuncian.                          |

## 4. Requisitos no funcionales

- Responsive: de celular a escritorio, sin scroll horizontal.
- Movimiento: los bloques aparecen al bajar, con CSS (animaciones ligadas al scroll), sin librerías. Con movimiento reducido o en navegadores sin soporte, el contenido se ve quieto, nunca oculto. El scroll es el nativo del navegador (sin inercia).
- Campo binario (RF-12): el contenido se muestra primero y el canvas llega después, con un fundido. Se pausa fuera de pantalla, limita sus cuadros por segundo y su resolución, y con movimiento reducido dibuja un solo cuadro quieto. Código propio en TypeScript, sin dependencias y sin relajar la CSP.
- Las animaciones que no terminan (latidos de la "b" y del botón de la barra) solo mueven `opacity` o `transform`, para no ocupar el hilo principal.
- Navegación entre páginas con transición nativa del navegador (`@view-transition`), sin JavaScript. Donde no exista, el cambio es instantáneo.
- Firma visual: cada sección lleva una etiqueta en estilo código (ej. `// 01 servicios`) sobre su título. El título es una frase con postura, aprobada por el dueño; hasta entonces queda el actual. Las secciones alternan el fondo y la superficie de marca para separarse sin depender solo del espacio.
- Al volver a abrir el sitio arranca desde arriba: los links internos no dejan el ancla (`#cotizacion`) en la dirección.
- Accesibilidad objetivo WCAG 2.2 AA.
- Rendimiento en móvil (Lighthouse): puntuación ≥ 95, LCP ≤ 2 s, TBT ≤ 200 ms, CLS ≤ 0,05. El campo binario suma como máximo 10 KB de JavaScript comprimido.
- SEO básico: `title`, `meta description`, Open Graph, `sitemap.xml`, `robots.txt`, favicon con el símbolo "b".
- Seguridad: HTTPS, cabeceras de seguridad, sin secretos en el repo, validación en servidor.

## 5. Marca

Ver `CLAUDE.md` (tokens) y el lienzo de diseño "Binalis — Identidad de marca".

## 6. Contenido pendiente (placeholders)

En el sitio publicado **no se ve ningún placeholder**: lo que falta se oculta o se reemplaza por diseño. Un proyecto sin capturas muestra una tarjeta de código con su stack; si falta Problema o Resultado, esa fila no aparece. Los textos de marca los aprueba el dueño antes de publicarse.

- Proyectos: los tres tienen captura real (2026-10-19). Las capturas nunca muestran datos personales de clientes (nombres, teléfonos, montos); métricas agregadas sí, con aprobación del dueño. Resultado de YERON con números reales al cierre de la campaña (15 de enero de 2027).
- Testimonios reales: se piden con el formulario de Google "Binalis — Opinión de clientes" (link en `BITACORA.md`). Primero: Ederth Gledde, CEO de Cosmos Trak, que aprobó el texto y la ortografía de su nombre (2026-10-19).
- Instagram, Facebook y LinkedIn (WhatsApp: +595 983 755 161; correo: `contacto@binalis.com.py`).

## 7. Fuera de alcance v1

Blog, versión en otros idiomas, panel de administración, pagos. Para v2: formulario de cotización con envío serverless, servicio de correo y Turnstile.

## 8. Decisiones tomadas

- Sello binario (2026-10-30, opción A aprobada por el dueño): para diferenciarse en el sector, la idea del logo (1 y 0) pasa a ser la experiencia de la portada, con el campo binario (RF-12), cotización por necesidad (RF-08), títulos con postura, secciones con más textura y transiciones entre páginas. Es una excepción acotada a "JS mínimo" y mantiene la decisión del 2026-10-19 de no usar partículas 3D ni cursor personalizado. Referencia: Omarchy (`omacom/omarchy-site`, sin licencia publicada), que se toma como inspiración, sin copiar su código. No se suman React, temas ni música: costarían peso sin aportar a la cotización.
- Rediseño "con sello" (2026-10-19, aprobado por el dueño): contar el logo (1 y 0), portada con atmósfera, etiquetas de código, proyectos verificables, cotización por correo, barra fija, aparición al bajar y 404 propia. Sin inercia de scroll (marea y pelea con touchpads), sin carruseles, contadores inventados, partículas 3D ni cursor personalizado.
- La empresa es la protagonista, no la persona (2026-10-15, pedido del dueño): en RF-10 la foto es un avatar chico junto al nombre. El versículo que el dueño recibió para Binalis va en el pie de todas las páginas.
- "Quién soy" en página propia (2026-10-15): la portada queda corta y enfocada en cotizar, y la historia tiene su URL para Google y para compartir. "Quién soy" y no "Quiénes somos": hoy Binalis es una persona.
- Sitio funcional antes que completo (2026-10-15): contacto por WhatsApp en lugar del formulario serverless, sin placeholders visibles e identidad de programador. Aprobado por el dueño.
- Nombre: **Binalis**. Identidad: oscuro, futurista, neón; wordmark y símbolo "b".
- Dominio: `binalis.com.py`, registrado en NIC.PY y habilitado (2026-10-14).
- Hosting: **Cloudflare Workers** (static assets), con DNS en Cloudflare. Se descartó Pages porque Cloudflare lo marca como flujo _legacy_ (2026-10-14).
- Repositorio **público** en GitHub (`Marthinmezaa/binalis-web`), `main` protegida, cambios solo por PR. CodeQL activo.
- Proyectos a mostrar (RF-05), elegidos por el dueño (2026-10-14): Cosmos Trak · Sitio web, Cosmos Trak · Sistema administrativo y YERON · Promoción con sorteos. El contenido sale de sus repositorios (privados, sin enlace al código).
- Correo: `contacto@binalis.com.py` en Zoho Mail Lite (2026-10-19). El plan gratis no estaba disponible. Configuración en `BITACORA.md`.
- Analítica: Cloudflare Web Analytics, que Cloudflare inyecta en el sitio (2026-10-30, aprobado por el dueño). La CSP permite solo su script, para poder medir las visitas.

## 9. Preguntas abiertas

Ninguna por ahora.

## 10. Criterios de aceptación globales

Todos los RF implementados · CI en verde · sin errores de accesibilidad críticos · sin placeholders visibles · sitio publicado en el dominio de Binalis.
