# BITACORA — Web de Binalis

Estado actual y trabajo reciente. Se actualiza al cerrar **cada** sesión. Cuando supere 15 entradas, las más antiguas pasan resumidas a `BITACORA.HISTORIAL.md`.

## Estado actual

- Diseño de la web aprobado en lienzo (4 láminas: logo, color y tipografía, aplicaciones, web).
- Repo público en GitHub con `main` protegida (4 checks obligatorios: calidad, gitleaks, dependencias, CodeQL).
- Dominio `binalis.com.py` habilitado y con DNS delegado a Cloudflare (`aurora` / `johnny.ns.cloudflare.com`).
- Hechos: barra superior (RF-01), portada (RF-02), Servicios (RF-03), Proceso (RF-04), Proyectos (RF-05), "siguiente proyecto cargando…" (RF-06), "Quién está detrás" (RF-10, resumen en portada + página `/quien-soy/`), Cotización por WhatsApp y correo (RF-08), pie con versión (RF-09), testimonios (RF-07) y 404 propia (RF-11); rediseño con sello (la "b" que se dibuja, etiquetas de código, aparición al bajar, barra fija); captura real en los tres proyectos; el sitio entero sin placeholders (textos aprobados por el dueño); favicon e íconos de app; SEO básico (canonical, Open Graph con imagen, `sitemap.xml` y `robots.txt`).
- Pruebas e2e con Playwright + axe en el CI (escritorio y celular), bajo la misma CSP de producción.
- release-please verificado con el secreto `RELEASE_PLEASE_TOKEN` (token fine-grained, solo este repo): el PR de release dispara el CI. La versión actual está en `package.json`.
- Repo con README, SECURITY.md (reporte privado de vulnerabilidades activado), descripción, topics y sitio web.

## Configuración fuera del repo

### Panel de Cloudflare

- DNS: `binalis.com.py` → Worker `binalis-web` (custom domain); `www` → `AAAA 100::` con proxy (solo existe para redirigir).
- Redirect Rule "Redirect www to root": `http.host eq "www.binalis.com.py"` → `concat("https://binalis.com.py", http.request.uri.path)`, 301, conserva query string.
- SSL/TLS: modo Full, **Always Use HTTPS** activado, TLS mínimo 1.2.
- Workers Builds: build `pnpm run build`, deploy `npx wrangler deploy`, preview `npx wrangler preview`, variable `PNPM_VERSION=11.20.0`, token de build propio del proyecto.

### Correo (Zoho Mail)

- `contacto@binalis.com.py`, superadministrador de la organización "Binalis" en Zoho (centro de datos de EE. UU.). Plan **Mail Lite 5 GB, 1 usuario, US$12 al año**, contratado el 2026-10-19: el plan gratis no aparecía para la cuenta.
- Registros DNS en Cloudflare (todos "DNS only"): TXT `@` `zoho-verification=zb81964450.zmverify.zoho.com`; MX `@` `mx.zoho.com` 10, `mx2.zoho.com` 20, `mx3.zoho.com` 50; TXT `@` `v=spf1 include:zohomail.com ~all`; TXT `zmail._domainkey` (DKIM RSA 1024 de Zoho); TXT `_dmarc` `v=DMARC1; p=none; rua=mailto:contacto@binalis.com.py`.
- No se cargaron los registros de ZeptoMail (CNAME `bounce-zem` y DKIM `1914745._domainkey`): son para correos automáticos de una aplicación. Se suman si la v2 manda correos desde el formulario.
- Clientes de correo: IMAP `imappro.zoho.com:993` y SMTP `smtppro.zoho.com:465`, SSL. Llevan "pro" por ser una organización paga; Outlook propone los servidores sin "pro" y hay que corregirlos.
- `marthinmeza@binalis.com.py` se puede sumar gratis como alias del mismo usuario.

### Formulario de testimonios (Google Forms, en el Drive del dueño)

- "Binalis — Opinión de clientes", publicado el 2026-10-19 para cualquiera con el link, sin inicio de sesión.
- Link para clientes: https://docs.google.com/forms/d/e/1FAIpQLSdrY-mdzdKZEjlA-XlcJsM4sG-V7yzBccfnn8GrghRsRzAULA/viewform
- Edición y respuestas (solo con la cuenta del dueño): https://docs.google.com/forms/d/1Ricb0nlJrzb0tSC4c6rfS0i9_53Rr34HFqrY26zP4os/edit
- 10 preguntas: nombre, empresa y cargo, tipo de proyecto, antes, después, qué destaca, recomendación en una o dos frases (la base del testimonio), conformidad del 1 al 5, qué mejorar (privada) y autorización para publicar (con nombre y empresa / solo nombre / sin nombre / no).

## Próximo paso

**Siguiente tarea: el punto 1 (redes sociales).** La v1 está completa salvo las redes, que dependen del dueño.

Al empezar en otra PC: `git pull` en `main` y `pnpm install`. Si Playwright no tiene Chromium: `pnpm exec playwright install chromium`. `pnpm build && pnpm test:e2e` debe dar **62/62**. Si `pnpm` no existe y `corepack enable` da EPERM: `npm install -g pnpm@11.20.0`.

Pendientes, en orden:

1. **Redes sociales** (Instagram, Facebook y LinkedIn), con `contacto@binalis.com.py`. Antes: renovación automática del dominio en NIC.PY y verificación en dos pasos en Zoho, Cloudflare, Google y GitHub (sin confirmar al 2026-10-19). Después, sumarlas al pie (RF-09).
2. **Más testimonios** (RF-07, hasta 3): pedirlos con el mismo formulario. Se suman en el arreglo de `Testimonials.astro`, siempre con el texto exacto aprobado por el cliente.
3. **Resultado de YERON** con los números reales al cierre de la campaña (15 de enero de 2027).

## Entradas

### 2026-10-20 (33)

- Pedidos del dueño: en el testimonio, el cargo arriba y el nombre abajo, igual que en "Quién está detrás". En la portada, "Quién está detrás" sin el resumen de dos líneas: foto, cargo, nombre y "Conocé mi historia" apilados y centrados junto a la tarjeta de código (sin huecos), con el nombre más chico (Binalis es el protagonista). `/quien-soy/` conserva el nombre grande como título de página. Spec RF-10 actualizada.
- Historia: "mi padrastro, el Ing. Fernando Rojas". Tarjeta de código: `motor: "Jesús"`.
- Probado con capturas de Playwright (1440 px y 390 px). E2E 62/62.

### 2026-10-19 (32)

- #71 (0.24.0): los botones para cotizar brillan con jerarquía, a pedido del dueño ("la b es lo más importante"). La "b" es la más brillante y la única que late en la portada; el CTA de la barra late suave al bajar (`@container scroll-state(stuck: top)`); el de la portada brilla fijo; WhatsApp y correo se encienden al entrar en pantalla. Nunca más de un latido por pantalla.
- Lección de diseño: achicar las cajas del testimonio y la cotización (800 y 736 px contra 1152 del resto) rompió la grilla y se veía en escalera. El problema era el vacío adentro, no el tamaño: todos los bloques comparten bordes y las cajas anchas usan dos columnas. El testimonio decide con una container query (sirve si un día hay 3 en fila).
- "Quién está detrás" en la portada: caja como sus vecinas, columnas centradas en vertical y la tarjeta de código con fondo `--color-bg` (terminal incrustada). `/quien-soy/` sin cambios.
- #73: "Siguiente proyecto" con el stack del CRM (el del sistema de Cosmos Trak: React y PostgreSQL, según el dueño), un porcentaje que avanza con la barra (un solo `@property --progress` entero mueve los dos) y "¿Querés uno para tu empresa? Hablemos". En Proceso, la línea de cada paso se llena al bajar, en secuencia en escritorio. 404 en 8 bits: la "b" y el "404" en magenta dibujados píxel a píxel en SVG a partir de filas de texto, armados fila por fila con `steps(13)`.
- 8 bits solo en la 404, a propósito: en el resto chocaría con la estética futurista de la marca.
- Probado en Claude in Chrome (1920 px) y con emulación de Pixel 7 e iPhone 15. El único error de consola en la 404 es su propio status 404, que es lo esperado.
- La config estricta prohíbe `!` (non-null assertion): en la 404 se tipó `CODE` con `as const` para no necesitarlo.
- E2E 62/62.

### 2026-10-19 (31)

- #62 y #63 mergeados por el dueño (0.20.0 y 0.21.0). Probado antes en Claude in Chrome (escritorio, Chrome 155) y con emulación de Pixel 7 e iPhone 15: el bug del salto quedó resuelto. La ventana maximizada no se achica con `resize_window`, así que el celular se probó con Playwright.
- Portada al 85 % de la pantalla (antes al 100 %): sobraba un hueco al bajar y ahora asoma Servicios.
- CodeQL marcó en #63 `js/incomplete-multi-character-sanitization` (alta) en `generate-icons.mjs`: quitar etiquetas del `<h1>` con regex. El dueño aplicó un Copilot Autofix (otra regex encima) y se reemplazó por no limpiar nada: el `<h1>` es markup propio y entra tal cual, como el SVG. La imagen para compartir sale idéntica.
- #66 (0.22.0): versión en el pie (`v` + `package.json`, que release-please actualiza); aparición escalonada en escritorio (los hijos 2, 3 y 4 de una fila arrancan más tarde, como al apilarse en el celular); en "Quién soy", el cargo como etiqueta sobre el nombre, sin "Desarrollador full stack"; "servicio" en lugar de "jóvenes" en la tarjeta de código (la historia completa sigue nombrando a los jóvenes). Las e2e importan JSON con `with { type: "json" }` porque corren en Node.
- #67 (0.23.0): primer testimonio, de Ederth Gledde (CEO de Cosmos Trak), leído en el formulario con Claude in Chrome, a pedido del dueño. Autorizó nombre y empresa y aprobó el texto exacto y la ortografía de su nombre. Se publica: «Es 100% confiable.», su antes y después, y su calificación 5/5. Su respuesta a "qué mejorar" es privada. El PR se abrió en borrador hasta tener la aprobación.
- Un merge de Claude lo frenó el clasificador de permisos ("merge sin revisión"): el dueño mergea desde GitHub. Claude puede actualizar la rama con `gh pr update-branch` si el dueño lo pide.
- E2E 58/58.

### 2026-10-19 (30)

- Correo configurado también en la PC de ocio. Doble cobro descartado: un solo cargo de US$12. El segundo aviso era el crédito de regalo de ZeptoMail/CPaaS (10.000 correos, vence el 17 de abril de 2027), útil para el formulario de la v2.
- Bug: en el celular el sitio abría al final. Causa: tocar "Cotizá tu proyecto" dejaba `/#cotizacion` en la dirección y el navegador reabría ahí (reproducido con Playwright). Un listener de `hashchange` en `Layout.astro` limpia el ancla después del salto.
- Rediseño "con sello", aprobado entero por el dueño (spec actualizada): cotización por correo (`mailto:` con plantilla) además de WhatsApp, número de WhatsApp sin mostrar, portada con brillo y grilla, la "b" que se dibuja al cargar con la línea "// la b de binalis es un 1 y un 0", etiquetas de código sobre cada sección, aparición al bajar, barra fija translúcida, capturas en marco de navegador con link al sitio en vivo y 404 propia (`not_found_handling: "404-page"` en `wrangler.jsonc`).
- Scroll "como Cosmos Trak": Cosmos usa jQuery + AOS + `smoothscroll.js`. Se tomó solo la aparición al bajar, con CSS (`animation-timeline: view()`), sin librerías. La inercia de la rueda se descartó: toma el control del scroll y marea. Si el dueño la quiere igual, la opción es Lenis, justificada en un PR.
- Trampas: axe mide el contraste de un bloque a mitad de su aparición, así que la prueba de accesibilidad baja hasta el final antes de medir (y otra prueba falla si algún bloque queda semitransparente ahí, verificado rompiendo el rango). El aro dibujado con `stroke-dashoffset` dejaba una línea en la unión del trazo: se anima `stroke-dasharray` con relleno `backwards`. `pnpm icons` leía el `<h1>` sin etiquetas internas: ahora las quita.
- Python en Windows escribe CRLF: después de editar con un script, correr Prettier.
- E2E 56/56. PRs #62 (correo, número y salto) y #63 (rediseño, encima de #62).

### 2026-10-19 (29)

- Correo `contacto@binalis.com.py` funcionando en Zoho Mail (ver "Configuración fuera del repo"). El dueño creó la cuenta y pagó; Claude cargó los registros DNS en Cloudflare con Claude in Chrome, con permiso del dueño.
- Las opciones "Iniciar sesión en mi DNS" y "Configurar automáticamente" de Zoho no se usaron, porque le daban a Zoho permiso para editar el DNS de Cloudflare.
- Antes de cargar el DKIM se validó que la clave fuera una clave RSA válida. Después se comparó carácter por carácter con lo publicado en 1.1.1.1 y 8.8.8.8. Zoho marcó en verde MX, SPF y DKIM.
- La casilla es la cuenta `contacto` y no `marthinmeza`, porque es la dirección pública de la marca y no depende de una persona.
- El dueño la conectó a Outlook para Windows por IMAP.
- Pie (RF-09): se suma `contacto@binalis.com.py` con `mailto:`, definido en `src/contact.ts` junto al WhatsApp. La e2e del pie revisa el link. 46/46.
- Pendiente del dueño: en la bandeja llegaron dos correos "Credits purchase confirmation" a la misma hora. Hay que confirmar si uno es el crédito de regalo del plan anual o si hubo un doble cobro.

### 2026-10-19 (28)

- SEO básico de la spec completo (#57). Canonical y Open Graph en cada página, con URLs absolutas desde `Astro.site`. `robots.txt` apunta al sitemap.
- Imagen para compartir (`public/og-image.png`, 1200 × 630, 62 KB): la "b" con glow, el wordmark y el titular. La eligió el dueño entre esta y su foto. La genera `pnpm icons`, que toma el titular de `Hero.astro`: **si cambia el titular, correr `pnpm icons`**. Las fuentes van como `data:` porque `setContent` no tiene origen.
- `sitemap.xml` escrito a mano para las 2 páginas, con un `shortcut:` (pasar a `@astrojs/sitemap` cuando haya muchas). La e2e falla si una página de `PAGES` no está en el sitemap (verificado sacando una). 46/46.
- Verificado en producción: `robots.txt`, `sitemap.xml` y `og-image.png` responden 200, y la portada tiene canonical y Open Graph.
- Lección: commitlint rechaza un asunto que empieza en mayúscula ("feat: Open Graph…" cuenta como sentence-case). El asunto empieza en minúscula.

### 2026-10-19 (27)

- Textos aprobados por el dueño, uno por uno. Titular: "Desarrollo hecho con pasión y al detalle." Subtítulo: páginas web, landing pages, sistemas y promociones a medida para empresas, y "Escucho tu necesidad y la convierto en una herramienta que realmente funciona." En la portada no se nombra Paraguay, a pedido del dueño.
- Meta description en primera persona y con "Paraguay", porque ayuda a la búsqueda local (129 caracteres).
- Servicios: el dueño sentía que las 3 tarjetas lo limitaban (está por empezar un CRM con IA). No se suma una tarjeta de IA sin un proyecto para mostrar. En cambio, la de sistemas nombra CRM y automatizaciones con inteligencia artificial, y debajo de las tarjetas va "¿Tu idea no entra en ninguna? Contame y lo vemos juntos." con link a la cotización (RF-03).
- "Siguiente proyecto cargando…" nombra el proyecto en curso: CRM con inteligencia artificial (RF-06). Cuando esté terminado, pasa a Proyectos.
- Proceso: los 4 pasos con texto. Se le pidió al dueño que revisara que fueran promesas reales (presupuesto tras la primera charla, avances mientras construye, soporte después de entregar) y los aprobó.
- E2E: la prueba de placeholders ahora revisa el cuerpo y la meta description de las dos páginas (verificado que falla con uno inyectado), y los links a la cotización incluyen el nuevo. 40/40.
- Las capturas de Cosmos y YERON (#52) se revisaron en producción con Chrome: cargan las tres y la consola no muestra errores con la CSP real. La vista previa de Cloudflare pide sesión y no se revisó.
- El release 0.17.0 (#55) tenía en rojo el build de vista previa de Workers. El log mostraba un error de la API de Cloudflare al subir los archivos (`assets-upload-session`, "unknown error"), no del código. Con "Retry build" en el panel pasó. Ese check no es obligatorio para el merge.
- Testimonios (RF-07): la sección se va a llamar "Lo que dicen mis clientes", en primera persona como el resto del sitio. Se piden con un formulario de Google creado con Claude in Chrome (ver "Configuración fuera del repo"). La sección se arma cuando llegue la primera respuesta con autorización.

### 2026-10-19 (26)

- Sistema administrativo de Cosmos Trak con captura real en lugar de la tarjeta de stack: % de atraso, meta de ventas y el gráfico de avance anual de instalaciones (2024–2026). El dueño aprobó publicar esas métricas reales. Los montos salen ocultos por el modo privado de la app y no aparece ningún cliente.
- Cambio de spec aprobado por el dueño: las capturas nunca muestran datos personales de clientes, pero sí métricas agregadas con su aprobación (antes: "datos de prueba, nunca reales").
- Método: Chromium de Playwright visible con `--remote-debugging-port`. El dueño inició sesión en esa ventana, Claude capturó conectándose por CDP y recortó por los bordes de las tarjetas. El ancho de la ventana se ajustó a 2140 px para que el recorte quede en 16:9, como la otra captura. La sesión se borró al terminar y no hubo contraseñas en juego.
- Captura de 1416 × 793 px (50 KB): `astro:assets` sirve WebP de 8 a 24 KB.
- YERON: primera pantalla de la landing pública promoyeron.com.py (banner "Puede ser en Río" y botón "Quiero participar"), 1440 × 810 con Playwright headless, sin sesión. El formulario solo tiene textos de ejemplo. Se guarda en JPG (171 KB contra 1,26 MB en PNG) porque el banner es casi una foto.
- Con los tres proyectos con captura, la tarjeta de stack sale de Proyectos (`CodeCard` sigue en "Quién soy"). La regla de la spec "proyecto sin capturas → tarjeta de stack" se vuelve a implementar cuando aparezca uno; está en el historial de git.

### 2026-10-19 (25)

- La build de producción de la 0.15.0 falló al instalar Node.js 24.22.0 en Workers Builds (falla de descarga de Cloudflare); la siguiente pasó con la misma versión. El sitio no se vio afectado: la build de #48 ya había desplegado.
- `wrangler` pasa a devDependency fijada en 4.151.1. Antes `npx wrangler deploy` descargaba en cada deploy la última versión: la 4.151.2 se usó horas después de publicarse. Ahora la versión la decide el lockfile.
- Se eligió la 4.151.1 y no la 4.151.2 porque la política `minimumReleaseAge` de pnpm frena versiones recién publicadas. No se agregan excepciones a esa política.
- `pnpm-workspace.yaml` con `allowBuilds` en `false` para `esbuild` y `workerd`: los binarios llegan como dependencias opcionales, sin correr scripts de instalación. Verificado con `wrangler deploy --dry-run`.

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
