import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { parseCvYaml } from "../src/lib/cv-schema.ts";
import { buildCvView } from "../src/lib/cv-view.ts";

const CV_PATH = new URL("../../../cv/Kent_Liusudarso_CV.yaml", import.meta.url);

test("the committed English CV satisfies the web schema and view model", () => {
  const document = parseCvYaml(readFileSync(CV_PATH, "utf8"));

  assert.equal(document.cv.name, "Kent Liusudarso");

  const view = buildCvView(document.cv);
  assert.ok(view.experience.length > 0);
  assert.ok(view.education.length > 0);
  assert.ok(view.contacts.length >= 2);
  assert.ok(view.skills.length > 0);
  assert.match(view.experience[0].dates, /\d{4}/);
  assert.ok(view.profile.initials.length > 0);

  for (const contact of view.contacts) {
    assert.match(contact.href, /^(https?:|mailto:|tel:)/);
    assert.ok(contact.title.length > 0);
  }

  const digihatch = view.awards.find((award) => award.name.includes("Digihatch"));
  assert.ok(digihatch, "the Digihatch award is rendered");
  assert.equal(digihatch.name.includes("]("), false, "no raw markdown in the name");
  assert.equal(digihatch.href, "https://www.dexagroup.com/");
  assert.equal(digihatch.location, "Jakarta, Indonesia");
});
