#!/usr/bin/env python3
"""Generate the committed RenderCV documents from ``source/cv.yaml``.

The source holds every shared fact once; this script expands it into one
document per locale.  The generated documents stay committed so that RenderCV
and the web build keep consuming them without running this script.

Usage
-----
    uv run python scripts/build_cv.py          # rewrite the generated documents
    uv run python scripts/build_cv.py --check  # fail (exit 1) when they differ

Source layout
-------------
``schema``
    RenderCV schema URL, emitted as the ``# yaml-language-server`` first line.
``shared``
    CV facts identical for every locale: name, email, phone, social networks,
    and the design/settings fragments every locale reuses.
``sections``
    Ordered list of ``{titles: {<locale>: ...}, entries: [...]}``.  Inside an
    entry a field is either a plain scalar (byte-identical in every locale) or
    a ``{<locale>: value}`` mapping (translated); ``highlights`` is always a
    ``{<locale>: [...]}`` mapping.
``locales``
    Per-locale ``output_file``, ``location``, ``language``, ``design`` and
    ``settings``.  ``design`` and ``settings`` are deep-merged over the
    ``shared`` fragments, so a locale only states what makes it different.
"""

from __future__ import annotations

import argparse
import difflib
import io
import os
import sys
from collections.abc import Mapping
from pathlib import Path
from typing import Any

from ruamel.yaml import YAML
from ruamel.yaml.comments import CommentedMap
from ruamel.yaml.error import YAMLError

CV_DIR = Path(__file__).resolve().parent.parent
SOURCE_PATH = CV_DIR / "source" / "cv.yaml"
SCHEMA_HEADER = "# yaml-language-server: $schema={schema}"


class BuildError(Exception):
    """A source document cannot be expanded."""


def _represent_null(representer: Any, _data: None) -> Any:
    """Emit ``null`` instead of an empty value, which reads ambiguously."""
    return representer.represent_scalar("tag:yaml.org,2002:null", "null")


def new_yaml() -> YAML:
    """Return a round-trip YAML handler with the formatting the CVs use."""
    yaml = YAML()
    yaml.preserve_quotes = True
    yaml.width = 1000
    yaml.indent(mapping=2, sequence=4, offset=2)
    yaml.representer.add_representer(type(None), _represent_null)
    return yaml


def resolve(value: Any, locale_id: str, locale_ids: set[str], path: str) -> Any:
    """Collapse a node to one locale; a ``{locale: value}`` mapping is a translation."""
    if isinstance(value, Mapping):
        keys = set(value.keys())
        if keys and keys <= locale_ids:
            if locale_id not in value:
                raise BuildError(f"{path}: no {locale_id!r} value")
            return value[locale_id]
        return CommentedMap(
            (key, resolve(item, locale_id, locale_ids, f"{path}.{key}"))
            for key, item in value.items()
        )
    if isinstance(value, list):
        return [
            resolve(item, locale_id, locale_ids, f"{path}[{index}]")
            for index, item in enumerate(value)
        ]
    return value


def merge(base: Mapping[str, Any] | None, override: Mapping[str, Any] | None) -> CommentedMap:
    """Deep-merge ``override`` over ``base``; base keys keep their order."""
    merged = CommentedMap()
    for key, value in (base or {}).items():
        if key in (override or {}):
            other = override[key]
            merged[key] = (
                merge(value, other)
                if isinstance(value, Mapping) and isinstance(other, Mapping)
                else other
            )
        else:
            merged[key] = value
    for key, value in (override or {}).items():
        if key not in merged:
            merged[key] = value
    return merged


def build_document(source: CommentedMap, locale_id: str, locale_ids: set[str]) -> CommentedMap:
    shared = source["shared"]
    locale = source["locales"][locale_id]

    sections = CommentedMap()
    for section_index, section in enumerate(source["sections"]):
        titles = section["titles"]
        if locale_id not in titles:
            raise BuildError(f"sections[{section_index}].titles: no {locale_id!r} title")
        entries = [
            resolve(entry, locale_id, locale_ids, f"sections[{section_index}].entries[{index}]")
            for index, entry in enumerate(section["entries"])
        ]
        sections[titles[locale_id]] = entries

    cv = CommentedMap()
    cv["name"] = resolve(shared["name"], locale_id, locale_ids, "shared.name")
    cv["location"] = resolve(locale["location"], locale_id, locale_ids, "locales.location")
    cv["email"] = resolve(shared["email"], locale_id, locale_ids, "shared.email")
    cv["phone"] = resolve(shared["phone"], locale_id, locale_ids, "shared.phone")
    cv["social_networks"] = resolve(
        shared["social_networks"], locale_id, locale_ids, "shared.social_networks"
    )
    cv["sections"] = sections

    document = CommentedMap()
    document["cv"] = cv
    document["design"] = merge(shared.get("design"), locale.get("design"))
    document["locale"] = CommentedMap([("language", locale["language"])])
    document["settings"] = merge(shared.get("settings"), locale.get("settings"))
    return document


def serialize(document: CommentedMap, schema: str, yaml: YAML) -> str:
    buffer = io.StringIO()
    yaml.dump(document, buffer)
    return SCHEMA_HEADER.format(schema=schema) + "\n" + buffer.getvalue()


def resolve_output(locale_id: str, locale: Mapping[str, Any]) -> Path:
    """Resolve a configured output file, refusing escapes and source overwrites."""
    path = (CV_DIR / str(locale["output_file"])).resolve()
    if path == SOURCE_PATH.resolve() or not path.is_relative_to(CV_DIR.resolve()):
        raise BuildError(
            f"locales.{locale_id}.output_file must stay inside {CV_DIR} "
            "and cannot overwrite the source"
        )
    if path.suffix not in {".yaml", ".yml"}:
        raise BuildError(
            f"locales.{locale_id}.output_file must end in .yaml or .yml"
        )
    return path


def write_atomic(path: Path, text: str) -> None:
    """Write through a sibling temp file so an interrupted run leaves the old file."""
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(text, encoding="utf-8")
    os.replace(temporary, path)


def build_documents(
    source: CommentedMap, yaml: YAML
) -> list[tuple[Path, str]]:
    locales = source["locales"]
    if not isinstance(locales, Mapping) or not locales:
        raise BuildError("source is missing a non-empty 'locales' mapping")

    documents: list[tuple[Path, str]] = []
    seen: set[Path] = set()
    for locale_id, locale in locales.items():
        path = resolve_output(locale_id, locale)
        if path in seen:
            raise BuildError(f"locales.{locale_id}.output_file is configured twice")
        seen.add(path)
        documents.append(
            (
                path,
                serialize(
                    build_document(source, locale_id, set(locales)),
                    source["schema"],
                    yaml,
                ),
            )
        )

    configured = {path.resolve() for path, _ in documents}
    unconfigured = sorted(
        path
        for path in CV_DIR.glob("*_CV*.yaml")
        if path.resolve() not in configured
    )
    if unconfigured:
        raise BuildError(
            "unconfigured generated document(s): "
            + ", ".join(path.name for path in unconfigured)
        )
    return documents


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Generate the RenderCV documents from source/cv.yaml."
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="do not write; exit 1 after printing a diff when a committed document is stale",
    )
    args = parser.parse_args(argv)

    try:
        source = new_yaml().load(SOURCE_PATH.read_text(encoding="utf-8"))
        documents = build_documents(source, new_yaml())
    except BuildError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    except YAMLError as error:
        print(f"error: {SOURCE_PATH} is not valid YAML: {error}", file=sys.stderr)
        return 1
    except KeyError as error:
        print(f"error: source is missing required key {error}", file=sys.stderr)
        return 1
    except OSError as error:
        print(f"error: cannot read {SOURCE_PATH}: {error}", file=sys.stderr)
        return 1

    stale = 0
    try:
        for path, text in documents:
            current = path.read_text(encoding="utf-8") if path.exists() else ""
            if not args.check:
                if current == text:
                    print(f"{path.name}: up to date")
                else:
                    write_atomic(path, text)
                    print(f"{path.name}: updated")
            elif current != text:
                stale += 1
                name = path.relative_to(CV_DIR)
                sys.stdout.writelines(
                    difflib.unified_diff(
                        current.splitlines(True),
                        text.splitlines(True),
                        fromfile=str(name),
                        tofile=f"{name} (regenerated)",
                        n=2,
                    )
                )
    except OSError as error:
        print(f"error: cannot write generated documents: {error}", file=sys.stderr)
        return 1

    if stale:
        print(
            f"error: {stale} document(s) stale, run `uv run python scripts/build_cv.py`",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
