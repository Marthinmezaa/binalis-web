# BITACORA.HISTORIAL — Web de Binalis

Archivo de entradas antiguas de `BITACORA.md`, resumidas. Más reciente arriba.

## Cómo se usa

- Cuando `BITACORA.md` supera 15 entradas, mover las más antiguas aquí.
- Cada bloque resume un período en pocas líneas: decisiones, hitos y PRs relevantes. No copiar el detalle día por día.
- No se edita el pasado: si algo cambió, se registra en `BITACORA.md`.

## Historial

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
