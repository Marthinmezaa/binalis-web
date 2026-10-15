# ESPECIFICACIONES — Web de Binalis

Documento vivo (_Spec_ del flujo SDD). Todo cambio de alcance se registra aquí antes de implementarse.

## 1. Objetivo

Presentar Binalis, mostrar los proyectos realizados con su proceso de trabajo y captar consultas de cotización.

## 2. Público e idioma

Primero mercado local (Paraguay); a futuro, posiblemente el exterior. Idioma: **español** por ahora.

La web tiene que reflejar la **identidad del dueño como programador**: estética de código (JetBrains Mono en etiquetas y detalles técnicos) y una persona real detrás de la marca (RF-10).

## 3. Alcance v1

| ID    | Requisito                                                                                                                                                                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RF-01 | Barra superior con wordmark, anclas a Servicios, Proceso y Proyectos, link a "Quién soy" (`/quien-soy/`) y botón "Cotizá tu proyecto".                                                            |
| RF-02 | Portada con titular, subtítulo, botones "Cotizá tu proyecto" y "Ver proyectos", y el símbolo "b" con glow neón que pulsa (salvo con movimiento reducido).                                         |
| RF-03 | Servicios (3 tarjetas): Páginas web · Sistemas y apps a medida · Landing pages y promociones.                                                                                                     |
| RF-04 | Proceso de trabajo en 4 pasos: Conversamos · Diseñamos · Construimos · Entregamos y acompañamos.                                                                                                  |
| RF-05 | Proyectos: por cada uno, etiquetas, nombre, descripción, medio (video corto o capturas) y bloques Problema / Solución / Resultado.                                                                |
| RF-06 | Bloque final de proyectos "siguiente proyecto cargando…" con barra de progreso animada.                                                                                                           |
| RF-07 | Testimonios: hasta 3, solo reales. La sección no se muestra hasta tener al menos uno.                                                                                                             |
| RF-08 | Cotización (`#cotizacion`): botón que abre WhatsApp con un mensaje ya escrito. El formulario con envío serverless queda para v2 (ver sección 7).                                                  |
| RF-09 | Pie con el versículo de Binalis (Mateo 11:28, RVR1960), WhatsApp, correo y redes (cada uno cuando exista) y © año.                                                                                |
| RF-10 | "Quién está detrás": en la portada, un resumen (foto, tarjeta de código, dos líneas y "Conocé mi historia"); en `/quien-soy/`, la historia completa del Ing. Marthin Meza. Texto aprobado por él. |

## 4. Requisitos no funcionales

- Responsive: de celular a escritorio, sin scroll horizontal.
- Accesibilidad objetivo WCAG 2.2 AA.
- Rendimiento: objetivo propuesto de Lighthouse ≥ 90 en móvil (a confirmar).
- SEO básico: `title`, `meta description`, Open Graph, `sitemap.xml`, `robots.txt`, favicon con el símbolo "b".
- Seguridad: HTTPS, cabeceras de seguridad, sin secretos en el repo, validación en servidor.

## 5. Marca

Ver `CLAUDE.md` (tokens) y el lienzo de diseño "Binalis — Identidad de marca".

## 6. Contenido pendiente (placeholders)

En el sitio publicado **no se ve ningún placeholder**: lo que falta se oculta o se reemplaza por diseño. Un proyecto sin capturas muestra una tarjeta de código con su stack; si falta Problema o Resultado, esa fila no aparece. Los textos de marca los aprueba el dueño antes de publicarse.

- Proyectos: Problema y Resultado del sitio de Cosmos Trak y de la promoción YERON; capturas del sistema administrativo (con datos de prueba, nunca reales) y video o capturas de la promoción YERON.
- Testimonios reales (se van a pedir a clientes).
- Correo con el dominio, Instagram y LinkedIn (WhatsApp: +595 983 755 161).
- Texto final del titular, de los servicios y de los pasos del proceso.

## 7. Fuera de alcance v1

Blog, versión en otros idiomas, panel de administración, pagos. Para v2: formulario de cotización con envío serverless, servicio de correo y Turnstile.

## 8. Decisiones tomadas

- La empresa es la protagonista, no la persona (2026-10-15, pedido del dueño): en RF-10 la foto es un avatar chico junto al nombre. El versículo que el dueño recibió para Binalis va en el pie de todas las páginas.
- "Quién soy" en página propia (2026-10-15): la portada queda corta y enfocada en cotizar, y la historia tiene su URL para Google y para compartir. "Quién soy" y no "Quiénes somos": hoy Binalis es una persona.
- Sitio funcional antes que completo (2026-10-15): contacto por WhatsApp en lugar del formulario serverless, sin placeholders visibles e identidad de programador. Aprobado por el dueño.
- Nombre: **Binalis**. Identidad: oscuro, futurista, neón; wordmark y símbolo "b".
- Dominio: `binalis.com.py`, registrado en NIC.PY y habilitado (2026-10-14).
- Hosting: **Cloudflare Workers** (static assets), con DNS en Cloudflare. Se descartó Pages porque Cloudflare lo marca como flujo _legacy_ (2026-10-14).
- Repositorio **público** en GitHub (`Marthinmezaa/binalis-web`), `main` protegida, cambios solo por PR. CodeQL activo.
- Proyectos a mostrar (RF-05), elegidos por el dueño (2026-10-14): Cosmos Trak · Sitio web, Cosmos Trak · Sistema administrativo y YERON · Promoción con sorteos. El contenido sale de sus repositorios (privados, sin enlace al código).

## 9. Preguntas abiertas

- ¿Qué correo con el dominio propio se va a usar? Recomendado: `contacto@binalis.com.py` con Zoho Mail (gratis) o Cloudflare Email Routing (solo reenvío).

## 10. Criterios de aceptación globales

Todos los RF implementados · CI en verde · sin errores de accesibilidad críticos · sin placeholders visibles · sitio publicado en el dominio de Binalis.
