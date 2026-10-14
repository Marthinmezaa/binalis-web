# BITACORA — Web de Binalis

Estado actual y trabajo reciente. Se actualiza al cerrar **cada** sesión. Cuando supere 15 entradas, las más antiguas pasan resumidas a `BITACORA.HISTORIAL.md`.

## Estado actual

- Diseño de la web aprobado en lienzo (4 láminas: logo, color y tipografía, aplicaciones, web).
- Repo público en GitHub con `main` protegida (4 checks obligatorios: calidad, gitleaks, dependencias, CodeQL).
- Dominio `binalis.com.py` habilitado en NIC.PY; falta delegar DNS a Cloudflare.
- Estructura Astro + TypeScript mergeada (PR #6): página base con tokens de marca, sin secciones aún.
- release-please con el secreto `RELEASE_PLEASE_TOKEN` (token fine-grained, solo este repo) para que el PR de release dispare el CI.

## Próximo paso

1. Confirmar que el PR de release (#7) dispara el CI; revisar y mergear los PRs de Dependabot (#1–#5) una vez rebasados.
2. Conectar Cloudflare Pages al repo y delegar el DNS de `binalis.com.py` a Cloudflare.
3. Siguiente PR: layout + RF-01 (barra superior) y RF-02 (portada), con fuentes de marca.
4. Instalar Gentle-AI en cada PC (Ponytail ya activo).

## Entradas

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
