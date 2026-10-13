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
│   ├── Kent_Liusudarso_CV.yaml     # English
│   ├── Kent_Liusudarso_CV_ja.yaml  # Japanese
│   ├── pyproject.toml       # rendercv[full]==2.8
│   └── rendercv_output/     # generated, gitignored, released
├── .github/workflows/       # CI: rendercv, release, web build
├── pnpm-workspace.yaml
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

# Render the CVs locally (English + Japanese)
cd cv
for cv_file in *_CV*.yaml; do
  uv run rendercv render "$cv_file"
done

# Lint / typecheck / build
pnpm -r run build
pnpm -r run typecheck
```

## Releases

Push a tag of the form `v*` (e.g. `v2025.06.0`) to trigger the
`Release a CV` workflow, which renders every CV and attaches the PDFs + Typst
sources to a GitHub release.

## Editing the CV

Edit `cv/Kent_Liusudarso_CV.yaml` (English) and/or
`cv/Kent_Liusudarso_CV_ja.yaml` (Japanese). The two are independent files that
share no content, so a change to one does not affect the other. Pushing to
`main` re-renders every CV in `cv/`, and the generated Markdown
(`cv/README.md`, `cv/README_ja.md`) is auto-committed back when it changes.
The PDFs and Typst sources are gitignored — they ship as release assets.
