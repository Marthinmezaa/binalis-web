# BITACORA — Web de Binalis

Estado actual y trabajo reciente. Se actualiza al cerrar **cada** sesión. Cuando supere 15 entradas, las más antiguas pasan resumidas a `BITACORA.HISTORIAL.md`.

## Estado actual

- Diseño de la web aprobado en lienzo (4 láminas: logo, color y tipografía, aplicaciones, web).
- Repo público en GitHub con `main` protegida (4 checks obligatorios: calidad, gitleaks, dependencias, CodeQL).
- Dominio `binalis.com.py` habilitado y con DNS delegado a Cloudflare (`aurora` / `johnny.ns.cloudflare.com`).
- Hechos: barra superior (RF-01), portada (RF-02), Servicios (RF-03), Proceso (RF-04), Proyectos (RF-05), "siguiente proyecto cargando…" (RF-06), Cotización por WhatsApp (RF-08) y pie (RF-09); quedan textos placeholder; favicon e íconos de app.
- Pruebas e2e con Playwright + axe en el CI (escritorio y celular), bajo la misma CSP de producción.
- release-please verificado con el secreto `RELEASE_PLEASE_TOKEN` (token fine-grained, solo este repo): el PR de release dispara el CI. Versión actual: 0.8.0.
- Repo con README, SECURITY.md (reporte privado de vulnerabilidades activado), descripción, topics y sitio web.

## Configuración fuera del repo (panel de Cloudflare)

- DNS: `binalis.com.py` → Worker `binalis-web` (custom domain); `www` → `AAAA 100::` con proxy (solo existe para redirigir).
- Redirect Rule "Redirect www to root": `http.host eq "www.binalis.com.py"` → `concat("https://binalis.com.py", http.request.uri.path)`, 301, conserva query string.
- SSL/TLS: modo Full, **Always Use HTTPS** activado, TLS mínimo 1.2.
- Workers Builds: build `pnpm run build`, deploy `npx wrangler deploy`, preview `npx wrangler preview`, variable `PNPM_VERSION=11.20.0`, token de build propio del proyecto.

## Próximo paso

1. **Correo:** el dueño elige Zoho Mail gratis (recibir y responder) o Cloudflare Email Routing (solo reenvío) para `contacto@binalis.com.py`. Son excluyentes (los dos usan el MX). Después se suma al pie.
2. Sacar los placeholders visibles de Proyectos: tarjeta de código en lugar de medio faltante y ocultar Problema/Resultado si falta.
3. JetBrains Mono completa (subset latin) para etiquetas y detalles técnicos.
4. Borradores de titular, subtítulo, servicios y proceso para que el dueño apruebe; RF-10 "Quién está detrás" con su texto.
5. **En una PC sin preparar:** `git pull`, `pnpm install`, una vez `pnpm exec playwright install chromium`; `pnpm build && pnpm test:e2e` debe dar 24/24. Si `corepack enable` da EPERM: `npm install -g pnpm@11.20.0`.

## Entradas

### 2026-10-15 (18)

- Cambio de spec aprobado por el dueño: sitio funcional antes que completo. Cotización por WhatsApp (el formulario serverless pasa a v2), ningún placeholder visible, testimonios ocultos hasta tener uno real, identidad de programador y nueva RF-10 "Quién está detrás".
- RF-08: sección `#cotizacion` con "Hablemos por WhatsApp" (`wa.me` con mensaje ya escrito) y el número visible. Los botones "Cotizá tu proyecto" ya no apuntan a la nada.
- RF-09: pie con wordmark, WhatsApp y © año. El año se fija al compilar (`shortcut:`): se actualiza con el primer deploy de cada año. El correo y las redes se suman cuando existan.
- Número en un solo lugar: `src/contact.ts`. `.wordmark-accent` pasó a `global.css` (lo usan barra y pie).
- Recomendación de correo: `contacto@binalis.com.py`, con Zoho gratis si se responde por correo o Cloudflare Email Routing si todo va por WhatsApp; Google Workspace (~US$7/mes) cuando se justifique.

### 2026-10-15 (17)

- RF-06: al final de Proyectos, el bloque "Siguiente proyecto cargando…" con una barra de progreso de degradé de marca. Es solo CSS: se llena con el scroll (`animation-timeline`) mientras el bloque entra en pantalla, así nunca se mueve sola en bucle (WCAG 2.2.2). Si el navegador no lo soporta o el usuario pide menos movimiento, la barra queda quieta al 70%.
- Dos trampas de esa animación: el minificador fusionaba `animation` + `animation-timeline` en un shorthand que Chrome descarta (se escriben longhands), y un `overflow: hidden` en la barra se volvía su contenedor de scroll y la dejaba congelada. Verificado midiendo el ancho a distintas alturas de scroll: 14% → 51% → 74% → 90%.
- Gentle-AI no se instala: solo se sigue su filosofía (decisión del dueño). Actualizado `CLAUDE.md`.
- El dueño quiere el sitio **funcional** sin tener que juntar ahora videos, fotos ni textos, y que represente su **identidad como programador**. Queda propuesta como cambio de spec, a la espera de aprobación.

### 2026-10-14 (16)

- RF-05 Proyectos con los tres elegidos por el dueño: Cosmos Trak · Sitio web, Cosmos Trak · Sistema administrativo y YERON · Promoción con sorteos. Cada uno con etiquetas, descripción, medio y Problema / Solución / Resultado (`<dl>`). En escritorio, imagen y texto alternan de lado.
- El contenido sale de los README de cada repo y del sitio en vivo; lo que no figura ahí queda como placeholder (ver spec, sección 6). Los repos son privados: sin enlace al código.
- Medio: captura de la portada pública de cosmostrak.com.py (`src/assets/proyectos/`). Al sistema administrativo no se le sacan capturas porque tiene datos reales de clientes; YERON no tiene URL pública.
- Nueva dependencia `sharp`, que `astro:assets` necesita para optimizar imágenes: la captura pasa de 473 KB a 22 KB (640 px) o 50 KB (1280 px) en WebP.
- Prueba inestable corregida: inyectar la CSP con `page.route` + `route.fetch` hacía un pedido extra que bajo carga daba `ETIMEDOUT` (1 de cada 450). Ahora `astro preview` envía la CSP de `public/_headers` (`server.headers`, solo en preview porque `astro dev` necesita scripts inline). Verificado: 450/450 con 8 workers.

### 2026-10-14 (15)

- Favicon sin fondo, a pedido: solo la "b", agrandada para llenar el ícono (14 de 16 px de alto), con barra y aro de 2 px exactos a 16 px y medidas enteras a 32 y 48 px.
- En pestañas claras el cian contrasta poco con el blanco: se lee gracias a la parte violeta. Si molesta, la opción es un SVG con `prefers-color-scheme` que use tonos más oscuros en modo claro.
- `apple-touch-icon` sin cambios visibles: sigue sobre fondo oscuro porque iOS pinta de negro lo transparente.

### 2026-10-14 (14)

- JetBrains Mono en los números del proceso: recortada a los dígitos 0–9 y fijada en peso 700 con fonttools (1,2 KB contra 40 KB), con licencia OFL al lado. Marcada con `shortcut:`: cuando haya texto técnico con letras, usar el subset latin completo de Fontsource.
- Símbolo "b" en celular: 8rem (antes ocupaba casi una pantalla). Servicios ahora aparece en la primera pantalla de un Pixel 7. En escritorio sigue en 16rem.
- Bug evitado: Vite incrusta como `data:` los assets de menos de 4 KB, y la CSP (`font-src 'self'`) los bloquea en producción. Se desactivó con `assetsInlineLimit: 0`.
- Las e2e ahora corren con la CSP de producción, leída de `public/_headers` e inyectada en el HTML, y fallan si la consola muestra errores. Así detectaron el bug anterior; se cierra el hueco "la CSP no se prueba en e2e" de la entrada (9).
- Para recortar fuentes: `pip install fonttools brotli` en un venv, `fontTools.varLib.instancer` para fijar el peso y `pyftsubset --unicodes=... --flavor=woff2`.

### 2026-10-14 (13)

- RF-03 Servicios (3 tarjetas en `<ul>`, con línea de degradé de marca) y RF-04 Proceso (4 pasos en `<ol>`; el número visible es decorativo, `aria-hidden`, porque la lista ya anuncia el orden). Descripciones como placeholders.
- `.section` y `.section-title` en `global.css`, para reusar en las secciones que siguen.
- Números de paso en Space Grotesk: JetBrains Mono costaría decenas de KB por cuatro dígitos. Se suma cuando haya texto técnico real.
- E2E: los títulos de tarjetas y pasos coinciden exactos con la spec, y los links de la barra apuntan al `id` de cada sección. Verificado que fallan si se cambia un título o un `id`.
- Lección: `git checkout --` no revierte archivos sin trackear; al romper a propósito archivos nuevos, revertir a mano.

### 2026-10-14 (12)

- Favicon a 16 px nítido: la "b" se redibujó sobre una grilla de 16 px (10 unidades = 1 px), con barra y aro de 2 px exactos. Antes medían 1,6 px y caían entre píxeles. También queda alineada a 32 y 48 px.
- Es un corte para tamaños chicos, más grueso que el de la portada (`BinalisSymbol.astro` no cambia), como los tamaños ópticos de una tipografía. Se corrigió el SVG porque es lo que muestran las pestañas; el `.ico` y el ícono de iOS se regeneraron con `pnpm icons`.

### 2026-10-14 (11)

- Íconos completos: `favicon.ico` (16, 32 y 48 px, PNG embebidos) y `apple-touch-icon.png` (180 px, cuadrado opaco con el glow de la portada). Se generan desde `public/favicon.svg`, la única fuente, con `pnpm icons` (usa el Chromium de Playwright, sin dependencias nuevas).
- Puede que no haya SVG definitivo del lienzo de marca: el símbolo actual queda como oficial. Si cambia, editar `BinalisSymbol.astro` y `favicon.svg` y correr `pnpm icons`.
- Nueva prueba e2e: los 3 íconos del `<head>` responden 200.
- Restaurada la entrada (9), que se había perdido al resolver el conflicto entre los PR #18 y #19.

### 2026-10-14 (10)

- Favicon `public/favicon.svg`: símbolo "b" sobre fondo de marca redondeado (se lee en pestañas claras y oscuras), sin glow porque a 16 px no se distingue. Producción daba 404 en `/favicon.ico`.
- Misma geometría que `BinalisSymbol.astro`, copiada a mano: al reemplazar el símbolo por el SVG del lienzo de marca, actualizar los dos.
- Verificado en Chrome (compu de trabajo): CSP activa en producción (bloquea script y estilo inline), consola limpia, foco visible, portada sin scroll horizontal a 390 px.

### 2026-10-14 (9)

- PC de trabajo preparada: `corepack enable` falla con EPERM (Node está en `C:\Nodejs`, requiere admin); se instaló pnpm 11.20.0 con `npm install -g`, que usa el perfil del usuario.
- Playwright + axe: `e2e/*.e2e.ts` (sufijo propio para que Vitest no los tome) sobre `astro preview`, en Chromium de escritorio y celular (Pixel 7). Prueban WCAG 2.2 AA con axe, que el primer foco sea "Saltar al contenido" y que no haya scroll horizontal.
- En el CI corren dentro del job `calidad` (check obligatorio), después del build.
- `astro preview` no aplica `public/_headers`: la CSP no se prueba en e2e.
- Verificado rompiendo la página a propósito (sin `lang`, skip-link a `#nada`, `main` de 200vw): fallan las 6 pruebas.
- Lección: en celular la prueba de scroll pasaba con la página rota, porque el navegador aleja el zoom y `window.innerWidth` crece con el contenido. Se compara contra `clientWidth`.

### 2026-10-14 (8)

- RF-01 (barra superior) y RF-02 (portada): layout, wordmark, navegación sin JS (en celular: wordmark + botón arriba, links abajo; el botón queda fuera de la nav porque es una acción), enlace "Saltar al contenido".
- Símbolo "b" armado en SVG a partir de la descripción de marca (barra = 1, aro = 0, degradé cian→violeta, glow con `drop-shadow`). Es una aproximación: reemplazar por el SVG del lienzo de marca cuando esté.
- Fuentes Space Grotesk y Manrope autoalojadas (woff2 variables, subset latin, ~23 KB c/u, licencia OFL junto a los archivos). No se usa `<Font />` de Astro porque inyecta CSS inline y la CSP lo bloquea.
- Titular, subtítulo y meta description quedan como placeholders.

### 2026-10-14 (7)

- Cabeceras de seguridad en producción (PR #13) y release 0.3.0.
- `www` redirige con 301 al dominio raíz; HTTP → HTTPS forzado; TLS 1.1 rechazado. Verificado con curl.
- Lección: un espacio inicial pegado en el valor de la regla impedía que coincidiera. Revisar siempre el _Expression Preview_.

### 2026-10-14 (6)

- Sitio en vivo en `https://binalis.com.py` vía Workers Builds (PR #12).
- Cabeceras de seguridad en `public/_headers`: CSP estricta sin `'unsafe-inline'` (CSS siempre externo con `inlineStylesheets: "never"`), HSTS sin `preload`, nosniff, DENY, Referrer y Permissions-Policy. Caché inmutable para `/_astro/*`.
- La CSP se amplía cuando entren Turnstile (`challenges.cloudflare.com`) y los videos embebidos.

### 2026-10-14 (5)

- Licencia propietaria mergeada (PR #11).
- DNS de `binalis.com.py` delegado a Cloudflare.
- Hosting: Pages → **Workers** (static assets). Cloudflare marca Pages como _legacy_; para un sitio estático el cambio es solo `wrangler.jsonc`.

### 2026-10-14 (4)

- Mergeados los PRs de Dependabot #1–#5 (actions a su última versión mayor, CI en verde).
- PR de release #7 cerrado y regenerado como #9 con `RELEASE_PLEASE_TOKEN`: el CI corrió; mergeado → v0.2.0.
- Los commits `docs:` y `chore:` no actualizan el PR de release: el token solo se ejercita con `feat:`/`fix:` o al recrear el PR.
- README y SECURITY.md; activado el reporte privado de vulnerabilidades; descripción, topics y web del repo.
- Licencia propietaria (`LICENSE`): repo público solo para consulta, todos los derechos reservados.
