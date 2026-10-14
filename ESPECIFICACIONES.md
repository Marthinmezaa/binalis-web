# ESPECIFICACIONES — Web de Binalis

Documento vivo (*Spec* del flujo SDD). Todo cambio de alcance se registra aquí antes de implementarse.

## 1. Objetivo

Presentar Binalis, mostrar los proyectos realizados con su proceso de trabajo y captar consultas de cotización.

## 2. Público e idioma

Primero mercado local (Paraguay); a futuro, posiblemente el exterior. Idioma: **español** por ahora.

## 3. Alcance v1

| ID | Requisito |
|---|---|
| RF-01 | Barra superior con wordmark y anclas: Servicios, Proceso, Proyectos y botón "Cotizá tu proyecto". |
| RF-02 | Portada con titular, subtítulo, botones "Cotizá tu proyecto" y "Ver proyectos", y el símbolo "b" con glow neón. |
| RF-03 | Servicios (3 tarjetas): Páginas web · Sistemas y apps a medida · Landing pages y promociones. |
| RF-04 | Proceso de trabajo en 4 pasos: Conversamos · Diseñamos · Construimos · Entregamos y acompañamos. |
| RF-05 | Proyectos: por cada uno, etiquetas, nombre, descripción, medio (video corto o capturas) y bloques Problema / Solución / Resultado. |
| RF-06 | Bloque final de proyectos "siguiente proyecto cargando…" con barra de progreso animada. |
| RF-07 | Testimonios: 3 espacios para completar cuando haya testimonios reales. |
| RF-08 | Cotización: formulario (nombre, WhatsApp o correo, tipo de proyecto, mensaje), envío por función serverless, antispam y mensaje de confirmación o error. |
| RF-09 | Botón de contacto por WhatsApp y pie con correo, redes y © año. |

## 4. Requisitos no funcionales

- Responsive: de celular a escritorio, sin scroll horizontal.
- Accesibilidad objetivo WCAG 2.2 AA.
- Rendimiento: objetivo propuesto de Lighthouse ≥ 90 en móvil (a confirmar).
- SEO básico: `title`, `meta description`, Open Graph, `sitemap.xml`, `robots.txt`.
- Seguridad: HTTPS, cabeceras de seguridad, sin secretos en el repo, validación en servidor.

## 5. Marca

Ver `CLAUDE.md` (tokens) y el lienzo de diseño "Binalis — Identidad de marca".

## 6. Contenido pendiente (placeholders)

- Nombres, descripciones, medios y resultados de cada proyecto (hay que confirmar qué proyectos se muestran y si el cliente autoriza nombrarlo).
- Testimonios reales (se van a pedir a clientes).
- Número de WhatsApp, correo, Instagram y LinkedIn.
- Texto final del titular y de los servicios.

## 7. Fuera de alcance v1

Blog, versión en otros idiomas, panel de administración, pagos.

## 8. Decisiones tomadas

- Nombre: **Binalis**. Identidad: oscuro, futurista, neón; wordmark y símbolo "b".
- Dominio: `.com.py` vía NIC.PY (disponible; registro por completar).
- Hosting: **Cloudflare Pages**, con DNS en Cloudflare.
- Repositorio en GitHub, `main` protegida, cambios solo por PR.

## 9. Preguntas abiertas

- ¿Se oculta la sección de testimonios hasta tener al menos uno?
- ¿Qué servicio de envío de correo se usa para el formulario?
- ¿Qué correo con el dominio propio se va a usar?
- ¿El repositorio será público o privado? (afecta CodeQL y la protección de ramas)

## 10. Criterios de aceptación globales

Todos los RF implementados · CI en verde · sin errores de accesibilidad críticos · formulario probado de punta a punta · sitio publicado en el dominio de Binalis.
