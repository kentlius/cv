# Kent Liusudarso — CV monorepo

This repository is one personal CV: the same structured source produces the
published PDF and the website that presents the same content as a browsable
page. Both outputs are generated, never hand-maintained, so a fix to a job
title or a date lands everywhere in one commit.

## Why one repository

The website and the PDF pipeline consume the same data, and the website's build
resolves that data by path at build time. Splitting the site into its own
repository would force either a duplicated copy of the CV or a network fetch
during the build — two failure modes traded for a repository boundary that buys
little. Instead the two toolchains stay separate but co-located: pnpm for
`apps/web`, uv for `cv/`. The only shared interface is the generated YAML,
which is committed, so either side can be built from a clean checkout.

## How the data flows

```
cv/source/cv.yaml            single structured source
        │  pnpm cv:build
        ▼
cv/Kent_Liusudarso_CV.yaml       ┐ generated, committed
cv/Kent_Liusudarso_CV_ja.yaml    ┘
        │                    │
        │ pnpm cv:render      │ imported by apps/web
        ▼                    ▼
cv/rendercv_output/         Astro site
(PDF, Typst — gitignored)
```

Dates, contact details, section structure and ordering are defined once; only
text that genuinely differs between languages — section titles, headings,
prose and localised names — is written per language. Factual fields therefore
cannot drift between the two documents.

## Layout

Only the parts that are not obvious from their names:

- `apps/web` — Astro + Tailwind site. It reads the generated English
  YAML through a content collection; its UI lives in the repo as local code
  rather than a generated component registry. Initial and scroll reveals, the
  draggable captionless footer globe, and the confetti/console script are the
  only client-side behaviour; everything else ships as static HTML. Header and
  pinned experience-location text links to the labeled globe and focuses its
  pin; a static sphere remains without JavaScript. The social preview is
  generated at build by Satori and Resvg (`/og.png`).
- `cv/source/cv.yaml` — the structured CV, and the only file edited by hand.
- `cv/scripts` — `build_cv.py` (source → RenderCV YAML) and `render-all.sh`
  (renders every `*_CV*.yaml`).
- `cv/rendercv_output` — render artifacts (PDF, Typst). Gitignored; PDFs ship
  as release assets.
- `.github/workflows` — CI runs the web tests, builds the site, checks that
  the generated YAML matches the source, and smoke-renders the CVs; a tag push
  runs the release.

## Common tasks

```sh
pnpm install     # web dependencies
pnpm cv:sync     # cv/.venv + RenderCV via uv
pnpm dev         # Astro dev server
pnpm test        # website tests
pnpm build       # static site build
pnpm cv:build    # regenerate the CV YAMLs from cv/source/cv.yaml
pnpm cv:render   # render every CV to PDF/Typst
```

`package.json` is the authoritative list of scripts; the above is only the
day-to-day surface.

Node, pnpm and Python versions are pinned by `.nvmrc`, the `packageManager`
field and `.python-version` respectively — use those, not a version in this
file.

## Editing the CV

1. Edit `cv/source/cv.yaml`.
2. Run `pnpm cv:build`.
3. Commit the source **and** the regenerated `cv/*_CV*.yaml`.

The generated YAMLs are derived files that are nonetheless tracked: the website
and RenderCV read them directly, so they must never be edited by hand. CI runs
`build_cv.py --check` and fails when they disagree with the source.

Everything RenderCV produces — `cv/rendercv_output/` and the generated
`cv/README*.md` — is output, not input. Run `pnpm cv:render` to recreate it
locally when you want to proof the PDF; never edit those files.

## Releases

Pushing a `v*` tag (for example `v2026.10.0`) renders every CV and attaches the
resulting PDFs to a GitHub release, replacing the previous release. Nothing in
the working tree needs to be prepared first — the source and generated YAMLs
committed on `main` are the input.
