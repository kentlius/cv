import assert from "node:assert/strict";
import { test } from "node:test";

import { parseCvYaml } from "../src/lib/cv-schema.ts";

test("parses the generated English document shape", () => {
  const document = parseCvYaml(`
cv:
  name: Kent Liusudarso
  location: Shizuoka, Japan
  email: kent@example.com
  social_networks:
    - network: LinkedIn
      username: kentlius
  sections:
    experience:
      - company: Toyota Motor East Japan
        position: Software Engineer
        start_date: 2025-08
        end_date: present
        highlights:
          - Shipped a thing
    skills:
      - label: Languages
        details: TypeScript, Python
`);

  assert.equal(document.cv.name, "Kent Liusudarso");
  assert.equal(document.cv.sections?.experience?.[0].start_date, "2025-08");
  assert.equal(document.cv.sections?.experience?.[0].end_date, "present");
  assert.equal(document.cv.sections?.skills?.[0].details, "TypeScript, Python");
});

test("normalizes numeric years to strings", () => {
  const document = parseCvYaml(`
cv:
  name: Kent Liusudarso
  sections:
    education:
      - institution: Institut Teknologi Bandung
        start_date: 2020
        end_date: 2024
`);

  assert.equal(document.cv.sections?.education?.[0].start_date, "2020");
  assert.equal(document.cv.sections?.education?.[0].end_date, "2024");
});

test("rejects a document without a top-level cv mapping", () => {
  assert.throws(() => parseCvYaml("name: Kent\n"), /top-level 'cv' mapping/);
  assert.throws(() => parseCvYaml(""), /top-level 'cv' mapping/);
});

test("rejects localized section keys instead of silently dropping them", () => {
  assert.throws(
    () =>
      parseCvYaml(`
cv:
  name: Kent Liusudarso
  sections:
    職歴: []
    学歴: []
`),
    /Unsupported CV section key\(s\): 職歴, 学歴/,
  );
});

test("rejects an entry missing a required field", () => {
  assert.throws(
    () =>
      parseCvYaml(`
cv:
  name: Kent Liusudarso
  sections:
    experience:
      - position: Software Engineer
`),
    /company/,
  );
});

test("rejects empty required values", () => {
  assert.throws(() => parseCvYaml(`cv:\n  name: ""\n`));
  assert.throws(() =>
    parseCvYaml(`
cv:
  name: Kent Liusudarso
  sections:
    experience:
      - company: ""
        position: Engineer
`),
  );
  assert.throws(() =>
    parseCvYaml(`
cv:
  name: Kent Liusudarso
  sections:
    skills:
      - label: Languages
        details: ""
`),
  );
});

test("rejects malformed YAML with the parser's reason", () => {
  assert.throws(() => parseCvYaml("cv: [unclosed"), /CV YAML could not be parsed/);
});
