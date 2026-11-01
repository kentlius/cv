import { getEntry } from "astro:content";

import { CV_ENTRY_ID, type Cv } from "./cv-schema";

/**
 * The one place pages read the CV from.
 *
 * Index wants a missing CV to fail the build; 404 wants to keep rendering.
 * Both go through this module so the entry id and the null policy live once.
 */
export async function getCvOrNull(): Promise<Cv | null> {
  const entry = await getEntry("cv", CV_ENTRY_ID);
  return entry?.data.cv ?? null;
}

export async function getCv(): Promise<Cv> {
  const cv = await getCvOrNull();
  if (!cv) {
    throw new Error(
      `CV entry "cv/${CV_ENTRY_ID}" was not found in the content collection.`,
    );
  }
  return cv;
}
