# CLAUDE.md — Web de Binalis

Sitio web de **Binalis** (desarrollo de software y páginas web, Paraguay). Dueño y único desarrollador: Marthin Meza.
Se trabaja desde **dos computadoras** (trabajo y ocio): todo el contexto vive en este repositorio, nunca solo en una PC.

## Al empezar cada sesión

1. `git pull` y confirmar la rama actual. **Nunca trabajar sobre `main`.**
2. Leer `ESPECIFICACIONES.md` (qué se construye) y `BITACORA.md` (estado actual y próximo paso).
3. Si la tarea no está en las especificaciones, proponer primero el cambio de spec y esperar aprobación.

## Al terminar cada sesión

1. Actualizar `BITACORA.md`: qué se hizo, decisiones, pendientes y próximo paso.
2. Si `BITACORA.md` supera 15 entradas, mover las más antiguas, resumidas, a `BITACORA.HISTORIAL.md`.
3. Commit y push de la rama de trabajo.

## Reglas inviolables

- **Nada de commits ni push directos a `main`** (está protegida). Flujo: rama → PR → CI en verde → squash merge.
- Ramas: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/` + descripción corta en kebab-case (ej. `feat/seccion-proyectos`).
- Commits en **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`). release-please los usa para versionar.
- Cero secretos en el repo. Las claves van como secretos de Cloudflare o GitHub; `.env*` está ignorado.
- No inventar contenido de marca. Lo pendiente se deja como placeholder `[ENTRE CORCHETES]` (ver `ESPECIFICACIONES.md`).
- No agregar dependencias sin justificarlas por escrito en el PR.

## Filosofía

### Clean Code

- Nombres que revelan intención; funciones chicas con una sola responsabilidad.
- Sin código muerto, sin duplicación, sin números mágicos.
- Comentarios solo para explicar el _porqué_, nunca el _qué_.
- Los errores se manejan en las fronteras (formularios, funciones serverless), no se ignoran.

### Ponytail (https://github.com/dietrichgebert/ponytail)

Escribir solo lo que la tarea necesita, sin recortar validación, manejo de errores, seguridad ni accesibilidad.
Antes de escribir código recorrer la escala: ¿hace falta? → ¿ya existe en el repo? → ¿lo resuelve la librería estándar? → ¿una función nativa de la plataforma? → ¿una dependencia ya instalada? → ¿una línea? → recién ahí, lo mínimo que funcione.

- Atajos conscientes se marcan con un comentario `shortcut:` indicando cuándo revisarlos.
- Comandos: `/ponytail`, `/ponytail-review` (revisar el diff antes de cada PR), `/ponytail-audit`, `/ponytail-debt`.
- Cada respuesta cierra indicando qué se omitió o no se verificó.

### Gentle-AI (https://github.com/Gentleman-Programming/gentle-ai)

Trabajo guiado por especificaciones (SDD) para todo cambio no trivial:
**Explore → Proposal → Spec → Design → Tasks → Apply → Verify → Archive.**

- La _Spec_ vive en `ESPECIFICACIONES.md`; el _Archive_ se registra en `BITACORA.md`.
- Si Gentle-AI modifica este archivo al configurarse, revisar el diff: este `CLAUDE.md` es la fuente de verdad.

## Stack

| Capa                     | Elección                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------- |
| Sitio                    | Astro + TypeScript estricto, CSS con variables (tokens de marca), JS mínimo             |
| Formulario de cotización | Cloudflare Pages Functions (TypeScript) + validación en servidor + Cloudflare Turnstile |
| Envío de correo          | Servicio transaccional (a definir), clave como secreto de Cloudflare                    |
| Medios                   | Video corto en YouTube/Vimeo no listado o Cloudflare R2; imágenes con `astro:assets`    |
| Calidad                  | pnpm, ESLint + Prettier, Vitest, Playwright (+ axe para accesibilidad)                  |
| Git                      | Husky + lint-staged + commitlint                                                        |
| Hosting                  | Cloudflare Pages conectado a GitHub (`main` = producción, cada PR = preview)            |
| Versiones                | release-please                                                                          |

## Comandos (deben existir en `package.json`)

`pnpm dev` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build`

El CI ejecuta lint, typecheck, test y build: si alguno falta, el PR no pasa.

## Marca (tokens)

- Colores: cian `#00F0FF`, violeta `#7B5CFF`, magenta `#FF2E9A` (solo toques), fondo `#06080F`, superficie `#0D1220`, texto `#E8ECF7`, texto secundario `#8A94B0`.
- Tipografías: Space Grotesk (títulos), Manrope (texto), JetBrains Mono (detalles técnicos).
- Logo: wordmark `bin` + `alis` (en cian) y símbolo "b" (barra = 1, aro = 0). Estilo: oscuro, futurista, neón.
- Diseño de referencia: lienzo "Binalis — Identidad de marca" (lámina 4 = web).

## Seguridad, accesibilidad y rendimiento

- Validar toda entrada en el servidor; sanitizar salida; cabeceras de seguridad en Cloudflare.
- Objetivo de accesibilidad: WCAG 2.2 AA (contraste, foco visible, etiquetas reales, navegación por teclado).
- Sitio rápido por defecto: sin JS innecesario, imágenes optimizadas, fuentes con `display=swap`.

## Definición de hecho

Cumple la spec · CI en verde · revisado con `/ponytail-review` · accesibilidad revisada · `BITACORA.md` actualizada · PR con descripción clara.
