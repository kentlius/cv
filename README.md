# Kent Liusudarso — Monorepo

A pnpm + uv monorepo containing:

- **`apps/web`** — the public CV website (Astro + React + Tailwind).
- **`cv/`** — the canonical CV in YAML, rendered to PDF/HTML/PNG via
  [RenderCV](https://rendercv.com). The rendered PDF is published as a GitHub
  release asset on every `v*` tag.

## Layout

```
.
├── apps/
│   └── web/                 # Astro CV site (pnpm)
├── cv/                      # CV source + rendercv pipeline (uv)
│   ├── Kent_Liusudarso_CV.yaml
│   ├── pyproject.toml       # rendercv[full]==2.8
│   └── rendercv_output/     # generated, gitignored, released
├── .github/workflows/       # CI: rendercv, release, web build
├── pnpm-workspace.yaml
├── pyproject.toml           # uv workspace root
├── .python-version          # 3.12
├── .nvmrc                   # 20
├── ruff.toml
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org) `>=20` (`nvm use`)
- [pnpm](https://pnpm.io) `>=9`
- [uv](https://docs.astral.sh/uv/) `>=0.4`

## Common tasks

```sh
# Install everything
pnpm install
uv sync

# Run the Astro site locally (http://localhost:4321)
pnpm dev

# Render the CV locally
uv run --package cv rendercv render cv/Kent_Liusudarso_CV.yaml \
  --output-path cv/rendercv_output

# Lint / typecheck / build
pnpm -r run build
pnpm -r run typecheck
```

## Releases

Push a tag of the form `v*` (e.g. `v2025.06.0`) to trigger the
`Release a CV` workflow, which renders the CV and attaches the PDF + Typst
source to a GitHub release.

## Editing the CV

Edit `cv/Kent_Liusudarso_CV.yaml`. Pushing to `main` re-renders the CV; the
rendered `cv/README.md` and `cv/Kent_Liusudarso_CV.typ` are auto-committed back
when their content changes.
