# Binalis — sitio web

Sitio de **Binalis**, desarrollo de software y páginas web en Paraguay: presenta los servicios, muestra proyectos con su proceso de trabajo y recibe pedidos de cotización.

Producción: <https://binalis.com.py>

## Stack

Astro + TypeScript estricto, CSS con variables (tokens de marca) y JS mínimo. Formulario de cotización con Cloudflare Pages Functions + Turnstile. Hosting en Cloudflare Pages.

## Requisitos

- Node.js 24 (ver `.nvmrc`)
- pnpm (versión fijada en `package.json` › `packageManager`)

## Comandos

```sh
pnpm install     # instala dependencias y los hooks de git
pnpm dev         # servidor de desarrollo
pnpm lint        # ESLint + Prettier
pnpm typecheck   # astro check
pnpm test        # Vitest
pnpm build       # build de producción en dist/
```

## Cómo se trabaja

- `main` está protegida: todo cambio entra por rama → PR → CI en verde → squash merge.
- Ramas `feat/`, `fix/`, `chore/`, `docs/`, `refactor/` y commits en [Conventional Commits](https://www.conventionalcommits.org/es/) (los valida commitlint).
- Las versiones y el `CHANGELOG.md` los genera release-please.

## Documentación

| Archivo                                      | Contenido                              |
| -------------------------------------------- | -------------------------------------- |
| [`ESPECIFICACIONES.md`](ESPECIFICACIONES.md) | Qué se construye (requisitos de la v1) |
| [`BITACORA.md`](BITACORA.md)                 | Estado actual y próximo paso           |
| [`CLAUDE.md`](CLAUDE.md)                     | Reglas, stack y marca                  |
| [`SECURITY.md`](SECURITY.md)                 | Cómo reportar vulnerabilidades         |

## Seguridad

Para reportar una vulnerabilidad, ver [`SECURITY.md`](SECURITY.md). No abrir issues públicos.

## Licencia

© 2026 Marthin Meza — Binalis. Todos los derechos reservados. Ver [`LICENSE`](LICENSE).
