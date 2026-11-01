import { defineCollection } from "astro:content";
import { file } from "astro/loaders";

import {
  CV_ENTRY_ID,
  CV_PATH,
  cvDocumentSchema,
  parseCvYaml,
} from "./lib/cv-schema";

const cvCollection = defineCollection({
  loader: file(CV_PATH, {
    parser: (text) => [{ id: CV_ENTRY_ID, ...parseCvYaml(text) }],
  }),
  schema: cvDocumentSchema,
});

export const collections = { cv: cvCollection };
