# BITACORA.HISTORIAL — Web de Binalis

Archivo de entradas antiguas de `BITACORA.md`, resumidas. Más reciente arriba.

## Cómo se usa

- Cuando `BITACORA.md` supera 15 entradas, mover las más antiguas aquí.
- Cada bloque resume un período en pocas líneas: decisiones, hitos y PRs relevantes. No copiar el detalle día por día.
- No se edita el pasado: si algo cambió, se registra en `BITACORA.md`.

## Historial

### 2026-10-15 — "Quién está detrás" (entrada 20)

- RF-10 con la versión A elegida por el dueño, entre Proyectos y Cotización: foto propia y tarjeta de código con sus datos.
- Foto llegada por WhatsApp sin EXIF ni GPS, guardada a 1200 px en `src/assets/`; `astro:assets` sirve WebP de 15 a 41 KB.
- JetBrains Mono completa (subset latin, 40 KB) en lugar del recorte de números. La edad de la tarjeta es fija (`shortcut:`).
- Lección: Astro descarta el espacio entre un texto y un `<strong>` que Prettier pasa a otra línea; se usa `&nbsp;`.

### 2026-10-15 — Datos de "Quién soy" (entrada 19)

- Datos de RF-10 dados por el dueño: Ing. electromecánico y técnico automotriz, programa desde 2023 (autodidacta, Full Stack en junio de 2026), estudia machine learning; la fe es central para él.
- El correo depende del dominio, no de Zoho: si cambia el plan se migran los MX. El riesgo real es que venza el dominio.
- Capturas: nunca de datos reales de clientes.

### 2026-10-15 — Cotización por WhatsApp y pie (entrada 18)

- Cambio de spec aprobado por el dueño: sitio funcional antes que completo (cotización por WhatsApp, formulario serverless a v2, sin placeholders visibles, testimonios ocultos hasta tener uno real, nueva RF-10 "Quién está detrás").
- RF-08 con `wa.me` y mensaje ya escrito; RF-09 pie con wordmark, WhatsApp y © año fijado al compilar (`shortcut:`). Número en un solo lugar: `src/contact.ts`.

### 2026-10-15 — Siguiente proyecto cargando (entrada 17)

- RF-06 con una barra ligada al scroll en CSS puro (`animation-timeline`), quieta al 70 % sin soporte o con movimiento reducido.
- Trampas: el minificador fusiona `animation` + `animation-timeline` en un shorthand que Chrome descarta (se escriben longhands), y un `overflow: hidden` en la barra la congelaba.
- Gentle-AI no se instala, solo se sigue su filosofía.

### 2026-10-14 — Proyectos (entrada 16)

- RF-05 con los tres proyectos elegidos por el dueño, con Problema / Solución / Resultado en `<dl>`. Los repos son privados: sin enlace al código.
- Nueva dependencia `sharp` para `astro:assets` (capturas de 473 KB a 22–50 KB en WebP).
- `astro preview` envía la CSP de `public/_headers` para las e2e; inyectarla con `page.route` daba timeouts esporádicos.

### 2026-10-14 — Favicon sin fondo (entrada 15)

- Favicon solo con la "b", agrandada para llenar el ícono, con trazos de 2 px exactos a 16 px. Después se reemplazó por la "b" oscura sobre disco cian (entrada 23), que se lee en pestañas claras.

### 2026-10-14 — Fuentes y CSP en e2e (entrada 14)

- Las e2e corren con la CSP de producción y fallan si hay errores en consola. Así se detectó que Vite incrustaba como `data:` los assets de menos de 4 KB y la CSP los bloqueaba; se arregló con `assetsInlineLimit: 0`.
- Símbolo "b" de 8rem en celular, para que Servicios entre en la primera pantalla.
- Para recortar fuentes: fonttools en un venv (`varLib.instancer` y `pyftsubset --flavor=woff2`). El recorte de JetBrains Mono a dígitos se reemplazó después por el subset latin completo (entrada 20).

### 2026-10-14 — Servicios y proceso (entrada 13)

- RF-03 Servicios (3 tarjetas en `<ul>`) y RF-04 Proceso (4 pasos en `<ol>`, con el número visible `aria-hidden` porque la lista ya anuncia el orden). `.section` y `.section-title` en `global.css` para reusar.
- E2E: los títulos de tarjetas y pasos coinciden exactos con la spec, y los links de la barra apuntan al `id` de cada sección.
- Lección: `git checkout --` no revierte archivos sin trackear; al romper a propósito archivos nuevos, revertir a mano.

### 2026-10-14 — Íconos y pruebas e2e (entradas 9 a 12)

- Playwright + axe en el job `calidad` del CI: WCAG 2.2 AA, foco inicial en "Saltar al contenido" y sin scroll horizontal, en escritorio y celular. En celular el scroll se compara contra `clientWidth`, porque el navegador aleja el zoom y `innerWidth` crece con el contenido.
- PC de trabajo: `corepack enable` da EPERM (Node en `C:\Nodejs`); pnpm 11.20.0 instalado con `npm install -g`.
- Favicon SVG (producción daba 404 en `/favicon.ico`), `favicon.ico` de 16/32/48 px y `apple-touch-icon.png`, generados con `pnpm icons` usando el Chromium de Playwright. Verificado en producción: CSP activa, consola limpia y foco visible.
- Favicon redibujado sobre una grilla de 16 px (barra y aro de 2 px exactos) para que se vea nítido: es un corte para tamaños chicos, más grueso que la "b" de la portada.

### 2026-10-14 — Barra superior y portada

- RF-01 y RF-02: barra con navegación sin JS y "Saltar al contenido"; símbolo "b" en SVG con glow, aproximado desde la descripción de marca (reemplazado el 2026-10-16 por el del lienzo).
- Fuentes Space Grotesk y Manrope autoalojadas (woff2 variables, subset latin, licencia OFL al lado); sin `<Font />` de Astro porque inyecta CSS inline que la CSP bloquea.

### 2026-10-14 — Cabeceras y redirecciones

- Cabeceras de seguridad en producción (PR #13), release 0.3.0. `www` → raíz con 301, HTTP → HTTPS, TLS 1.1 rechazado (verificado con curl).
- Lección: un espacio inicial en el valor de una regla de Cloudflare impide que coincida; revisar el _Expression Preview_.

### 2026-10-14 — Sitio en vivo

- Sitio publicado en `https://binalis.com.py` con Workers Builds (PR #12).
- Cabeceras de seguridad en `public/_headers`: CSP estricta sin `'unsafe-inline'` (CSS siempre externo), HSTS sin `preload`, nosniff, DENY, Referrer y Permissions-Policy; caché inmutable para `/_astro/*`.

### 2026-10-14 — Licencia y hosting

- Licencia propietaria mergeada (PR #11); DNS de `binalis.com.py` delegado a Cloudflare.
- Hosting: Pages → Workers (static assets), porque Cloudflare marca Pages como legacy.

### 2026-10-14 — Dependabot, release y documentación

- Mergeados los PRs de Dependabot #1–#5. PR de release regenerado con `RELEASE_PLEASE_TOKEN` → v0.2.0. Los commits `docs:`/`chore:` no actualizan el PR de release.
- README, SECURITY.md con reporte privado de vulnerabilidades y licencia propietaria (repo público solo para consulta).

### 2026-10-14 — Primer PR y dominio

- Mergeado el PR #6 (estructura Astro). Dominio `binalis.com.py` habilitado por NIC.PY.
- release-please: falló por falta de `package.json` y por un 500 transitorio de GitHub; se creó el secreto `RELEASE_PLEASE_TOKEN`.

### 2026-10-14 — Base del proyecto

- Repo público creado con `main` protegida; dominio `binalis.com.py` pagado en NIC.PY.
- Estructura Astro 7 + TS estricto, ESLint + Prettier, Vitest, Husky + lint-staged + commitlint.
- TypeScript fijado en `~6.0` (`typescript-eslint` no soportaba TS 7) y `.gitattributes` con LF para alternar PCs Windows sin romper `prettier --check`.

### 2026-10-14 — Arranque

- Nombre **Binalis** e identidad de marca aprobados: wordmark y símbolo "b", paleta cian/violeta/magenta sobre fondo oscuro.
- Estructura de la web definida (proyectos con proceso y video, "siguiente proyecto cargando…", testimonios, cotización y contacto), solo en español.
- Hosting inicial decidido en Cloudflare Pages (después se pasó a Workers, ver `ESPECIFICACIONES.md`).
- Base del proyecto preparada para trabajar con Claude Code desde dos PCs.
