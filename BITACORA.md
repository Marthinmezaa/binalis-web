# BITACORA — Web de Binalis

Estado actual y trabajo reciente. Se actualiza al cerrar **cada** sesión. Cuando supere 15 entradas, las más antiguas pasan resumidas a `BITACORA.HISTORIAL.md`.

## Estado actual

- Diseño de la web aprobado en lienzo (4 láminas: logo, color y tipografía, aplicaciones, web).
- Repo público en GitHub con `main` protegida (4 checks obligatorios: calidad, gitleaks, dependencias, CodeQL).
- Dominio `binalis.com.py` habilitado y con DNS delegado a Cloudflare (`aurora` / `johnny.ns.cloudflare.com`).
- Estructura Astro + TypeScript mergeada (PR #6): página base con tokens de marca, sin secciones aún.
- release-please verificado con el secreto `RELEASE_PLEASE_TOKEN` (token fine-grained, solo este repo): el PR de release dispara el CI. Versión actual: 0.2.0.
- Repo con README, SECURITY.md (reporte privado de vulnerabilidades activado), descripción, topics y sitio web.

## Configuración fuera del repo (panel de Cloudflare)

- DNS: `binalis.com.py` → Worker `binalis-web` (custom domain); `www` → `AAAA 100::` con proxy (solo existe para redirigir).
- Redirect Rule "Redirect www to root": `http.host eq "www.binalis.com.py"` → `concat("https://binalis.com.py", http.request.uri.path)`, 301, conserva query string.
- SSL/TLS: modo Full, **Always Use HTTPS** activado, TLS mínimo 1.2.
- Workers Builds: build `pnpm run build`, deploy `npx wrangler deploy`, preview `npx wrangler preview`, variable `PNPM_VERSION=11.20.0`, token de build propio del proyecto.

## Próximo paso

1. Siguiente PR: Playwright + axe (pruebas de accesibilidad y humo sobre la portada).
2. RF-03 Servicios y RF-04 Proceso.
3. Instalar Gentle-AI en cada PC (Ponytail ya activo).

## Entradas

### 2026-10-14 (8)

- RF-01 (barra superior) y RF-02 (portada): layout, wordmark, navegación sin JS (se acomoda en varias líneas en celular), enlace "Saltar al contenido".
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

### 2026-10-14 (3)

- Mergeado PR #6 (estructura Astro).
- Dominio `binalis.com.py` habilitado por NIC.PY.
- release-please: primer fallo por falta de `package.json`; el segundo fue un error 500 de GitHub, transitorio, resuelto al reintentar. Creado el secreto `RELEASE_PLEASE_TOKEN`.
- Pedido `@dependabot rebase` en #1–#5: sus checks fallidos eran de antes del PR #6.

### 2026-10-14 (2)

- Verificado: repo público creado y `main` protegida.
- Dominio `binalis.com.py` pagado en NIC.PY; pendiente de habilitación.
- Estructura Astro 7 + TS estricto, ESLint + Prettier, Vitest, Husky + lint-staged + commitlint.
- TypeScript fijado en `~6.0`: `typescript-eslint` aún no soporta TS 7.
- `.gitattributes` fuerza LF: con CRLF de Windows, `prettier --check` fallaría al alternar PCs.
- Playwright + axe quedan para el PR con la primera sección real (hoy no hay nada que probar).

### 2026-10-14

- Elegido el nombre **Binalis**; dominio e Instagram disponibles (por registrar).
- Aprobada la identidad de marca: wordmark y símbolo "b", paleta cian/violeta/magenta sobre fondo oscuro.
- Hosting decidido: Cloudflare Pages con DNS en Cloudflare.
- Definida la estructura de la web: proyectos con proceso y video corto, "siguiente proyecto cargando…", testimonios (pendientes), cotización y contacto. Solo español.
- Armada la base del proyecto para trabajar en Claude Code desde dos PCs.
