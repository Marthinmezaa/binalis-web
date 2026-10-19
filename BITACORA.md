# BITACORA — Web de Binalis

Estado actual y trabajo reciente. Se actualiza al cerrar **cada** sesión. Cuando supere 15 entradas, las más antiguas pasan resumidas a `BITACORA.HISTORIAL.md`.

## Estado actual

- Diseño de la web aprobado en lienzo (4 láminas: logo, color y tipografía, aplicaciones, web).
- Repo público en GitHub con `main` protegida (4 checks obligatorios: calidad, gitleaks, dependencias, CodeQL).
- Dominio `binalis.com.py` habilitado y con DNS delegado a Cloudflare (`aurora` / `johnny.ns.cloudflare.com`).
- Hechos: barra superior (RF-01), portada (RF-02), Servicios (RF-03), Proceso (RF-04), Proyectos (RF-05), "siguiente proyecto cargando…" (RF-06), "Quién está detrás" (RF-10, resumen en portada + página `/quien-soy/`), Cotización por WhatsApp (RF-08) y pie (RF-09); Proyectos sin placeholders; quedan los de portada, servicios y proceso; favicon e íconos de app.
- Pruebas e2e con Playwright + axe en el CI (escritorio y celular), bajo la misma CSP de producción.
- release-please verificado con el secreto `RELEASE_PLEASE_TOKEN` (token fine-grained, solo este repo): el PR de release dispara el CI. Versión actual: 0.14.0.
- Repo con README, SECURITY.md (reporte privado de vulnerabilidades activado), descripción, topics y sitio web.

## Configuración fuera del repo (panel de Cloudflare)

- DNS: `binalis.com.py` → Worker `binalis-web` (custom domain); `www` → `AAAA 100::` con proxy (solo existe para redirigir).
- Redirect Rule "Redirect www to root": `http.host eq "www.binalis.com.py"` → `concat("https://binalis.com.py", http.request.uri.path)`, 301, conserva query string.
- SSL/TLS: modo Full, **Always Use HTTPS** activado, TLS mínimo 1.2.
- Workers Builds: build `pnpm run build`, deploy `npx wrangler deploy`, preview `npx wrangler preview`, variable `PNPM_VERSION=11.20.0`, token de build propio del proyecto.

## Próximo paso

**Siguiente tarea: el punto 1 (borradores de textos).** Mismo método que con Proyectos (entrada 24): una pregunta por vez al dueño, un borrador por texto y aprobación antes de aplicarlo. Empezar por el titular y el subtítulo de la portada (`Hero.astro`), y seguir con la meta description (`index.astro`), los servicios y el proceso. Al terminar, la e2e de placeholders puede pasar de Proyectos a la página entera.

Al empezar en otra PC: `git pull` en `main` y `pnpm install`. Si Playwright no tiene Chromium: `pnpm exec playwright install chromium`. `pnpm build && pnpm test:e2e` debe dar **36/36**. Si `pnpm` no existe y `corepack enable` da EPERM: `npm install -g pnpm@11.20.0`.

Pendientes, en orden:

1. **Borradores de textos** para que el dueño apruebe: titular y subtítulo de la portada, meta description, descripciones de los 3 servicios y los 4 pasos del proceso. Tono: primera persona, apasionado, "amo lo que hago".
2. **Correo** `contacto@binalis.com.py` en Zoho Mail (gratis). Antes de vincular Instagram, Facebook y LinkedIn: renovación automática del dominio en NIC.PY y verificación en dos pasos en todas las cuentas. Después, sumar correo y redes al pie (RF-09).
3. **Capturas de proyectos** (opcional: la tarjeta de stack ya cubre el hueco) con datos de prueba, nunca reales. Los repos de Cosmos Trak y YERON no están en la PC Cardinallis-LAPTOP: ver si están en la otra, o si hay URL pública o usuario de prueba.
4. SEO pendiente de la spec: Open Graph (con la foto o el símbolo), `sitemap.xml` y `robots.txt`.

## Entradas

### 2026-10-19 (24)

- Proyectos sin placeholders visibles, con textos dados y aprobados por el dueño. Cosmos Trak · Sitio web cuenta el rescate: el programador anterior se fue sin dejar código ni acceso al hosting; se recuperó desde el sitio publicado, se migró de hosting y se cambió el DNS en NIC.PY. Resultado: las consultas, que antes no llegaban, ahora entran y se cuentan, más métricas de Meta. Bancard queda afuera hasta que esté habilitado.
- Sistema administrativo y YERON muestran una tarjeta de código con su stack en lugar de captura. `CodeCard.astro` sale de la tarjeta de "Quién soy" y la usan los dos lugares. En el sistema se corrigieron los roles (vendedor e instalador ahora son uno) y el resultado ("en producción las 24 horas").
- YERON: Problema (sin códigos precargados, la única prueba es la foto de la factura) y Resultado "en línea desde el 15 de octubre de 2026". `shortcut:` cambiarlo por los números reales al cierre (15 de enero de 2027).
- No se publica nada sensible de los CLAUDE.md de los proyectos: ni correos internos, ni precios, ni contactos, ni detalles del antifraude.
- E2E: cada proyecto falla si muestra un texto `[EN MAYÚSCULAS]` (verificado inyectando uno). 36/36.
- La regla de la spec "ocultar Problema/Resultado si falta" no se implementó porque hoy no falta ninguno. Se hace cuando aparezca un proyecto sin esos datos.

### 2026-10-16 (23)

- La "b" ahora es la del lienzo de marca, a pedido del dueño: el aro toca la barra (antes se superponían), barra cian sólida y aro con degradé violeta→cian. Brillo más suave: solo cian, en reposo 0,5rem al 35 % y en el pico 1rem al 55 % (antes había además un halo violeta grande). Sigue pulsando (RF-02).
- Íconos chicos como la lámina de aplicaciones: favicon = "b" oscura sobre disco cian (se lee en pestañas claras y oscuras, cierra el problema de contraste de la entrada 15); ícono de iOS = la misma "b" de la portada (proporciones incluidas) sobre tile superficie `#0D1220`: `pnpm icons` toma el SVG directo de `BinalisSymbol.astro`, así no hay geometría copiada a mano. El favicon conserva trazos más gruesos para leerse a 16 px.
- Foto de "Quién soy" con borde cian sólido y glow, como el perfil de Instagram del lienzo.

### 2026-10-15 (22)

- La "b" de la portada ahora "respira": el glow crece y baja cada 2,4 s, copiado del pulso de promoyeron.com.py (que lo aplica a su botón principal). Solo cambia la sombra, nunca posición ni opacidad, y no corre con `prefers-reduced-motion`.
- Foto de "Quién soy": de 22rem a un avatar redondo de 6rem junto al nombre, a pedido del dueño ("la empresa es el centro"). La historia va primero y la tarjeta de código a la derecha (abajo en celular), así `/quien-soy/` arranca con el `h1`.
- Versículo de Binalis en el pie de todas las páginas: Mateo 11:28 en RVR1960, en `<figure>` con `<blockquote>` y la cita en `figcaption`. Prueba e2e de la cita.
- Nueva e2e: la "b" tiene una animación y ninguna con `reducedMotion: "reduce"` (verificado que falla si se quita la media query). Revisado en Chrome: pulso de 55% a 90% de intensidad, avatar de 96 px en WebP, orden de lectura foto → `h1` → código, consola limpia bajo la CSP. La vista previa de Workers no se revisó: el Chrome de la PC no tiene sesión en Cloudflare.
- Esta PC necesitó `pnpm exec playwright install chromium` (el headless shell 1248 no estaba). 36/36.

### 2026-10-15 (21)

- "Quién soy" en página propia, a propuesta del dueño: la portada muestra un resumen (foto, tarjeta de código, dos líneas y "Conocé mi historia") y `/quien-soy/` la historia completa con `h1`, más Cotización y pie. Un solo componente `About.astro` con la prop `full`.
- Barra: links a `/#servicios`, `/#proceso` y `/#proyectos` (absolutos, para que funcionen desde otra página) y "Quién soy", con `aria-current="page"` en su página.
- Los links van a `/quien-soy/` con barra final: Astro genera `quien-soy/index.html` y Cloudflare redirige la URL sin barra.
- E2E: consola sin errores bajo la CSP, axe WCAG 2.2 AA y sin scroll horizontal ahora corren en las dos páginas. 34/34.

### 2026-10-15 (20)

- RF-10 "Quién está detrás", con la versión A elegida por el dueño y sus correcciones: nombra a su papá como "Dr. Juan Meza, PhD", el curso Full Stack en la UCSA, San Lorenzo, 31 años y su fe en Jesús (alabanza, jóvenes en una organización, CrossFit). Foto propia y tarjeta de código con sus datos. Va después de Proyectos y antes de Cotización.
- Foto: llegó por WhatsApp sin EXIF ni GPS; se guardó a 1200 px (142 KB) en `src/assets/` y `astro:assets` sirve WebP de 15 KB (escritorio) a 41 KB (celular).
- JetBrains Mono completa (subset latin, variable, 40 KB) en lugar del recorte de solo números: se usa en la tarjeta de código y en el cargo. Se cerró el `shortcut:` de `global.css`.
- La edad está fija en la tarjeta (`shortcut:`): actualizarla en cada cumpleaños.
- Lección: Astro descarta el espacio entre un texto y un `<strong>` que Prettier pasó a la línea siguiente ("respondió:«Porque…»"). Se usa `&nbsp;`.

### 2026-10-15 (19)

- Datos para RF-10, dados por el dueño: "Ing. Marthin Meza", 31 años, ingeniero electromecánico y técnico mecánico automotriz. Programa desde 2023, de forma autodidacta (HTML/CSS → Python → JavaScript); curso Full Stack terminado en junio de 2026, el mismo mes de su primer contrato. Hoy estudia machine learning. Lo que lo diferencia: la pasión ("realmente amás lo que hacés"). Fuera del código: baterista y bajista, sirve en alabanza y con jóvenes; la fe es central para él. Quiere su foto.
- Zoho: el correo depende del dominio, no de Zoho. Si el plan gratis cambia, se migra cambiando los MX y la dirección sigue igual. El riesgo real es que venza el dominio.
- Capturas: nunca de datos reales de clientes, aunque haya acceso.

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
