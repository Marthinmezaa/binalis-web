#!/usr/bin/env bash
# Crea el repo en GitHub, lo configura para trabajar solo con PR y protege main.
# Requisitos: git y gh instalados, y haber ejecutado `gh auth login`.
# Uso: ./scripts/setup-github.sh <usuario-u-org> <repo> [public|private]
# Ejecutar desde WSL o Git Bash, en la raíz del proyecto.
set -euo pipefail

OWNER="${1:?Falta el usuario u organización de GitHub}"
REPO="${2:?Falta el nombre del repositorio}"
VIS="${3:-public}"

if [ ! -d .git ]; then git init -b main; fi
git add -A
git commit -m "chore: estructura inicial del proyecto" || true

# 1. Crear el repo y subir el commit inicial (único push directo a main).
gh repo create "$OWNER/$REPO" "--$VIS" --source=. --remote=origin --push

# 2. Solo squash merge y borrar ramas al mergear.
gh repo edit "$OWNER/$REPO" \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false \
  --delete-branch-on-merge

# 3. Permitir que release-please abra PRs.
gh api -X PUT "repos/$OWNER/$REPO/actions/permissions/workflow" \
  -f default_workflow_permissions=read \
  -F can_approve_pull_request_reviews=true

# 4. Proteger main: solo por PR, con CI verde, sin force push, vale también para el admin.
CHECKS='"Lint, tipos y pruebas","Secretos (gitleaks)","Dependencias"'
if [ "$VIS" = "public" ]; then CHECKS="$CHECKS,\"CodeQL\""; fi

gh api -X PUT "repos/$OWNER/$REPO/branches/main/protection" --input - <<JSON
{
  "required_status_checks": { "strict": true, "contexts": [$CHECKS] },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "Listo: https://github.com/$OWNER/$REPO (main protegida)"
