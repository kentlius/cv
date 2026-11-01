import * as yaml from "js-yaml";
import { z } from "zod";

/** Entry id used by the content collection loader. */
export const CV_ENTRY_ID = "kent";

/**
 * Path from `src/content.config.ts` to the canonical English CV.
 * The web build reads the generated English document; Japanese section
 * titles are rendered by RenderCV, not by this app.
 */
export const CV_PATH = "../../cv/Kent_Liusudarso_CV.yaml";

const socialNetwork = z.object({
  network: z.string().min(1),
  username: z.string().min(1),
});

const dateValue = z
  .union([z.string(), z.number()])
  .transform((value) => (typeof value === "number" ? String(value) : value));

const optionalText = z.string().min(1).optional();
const highlights = z.array(z.string().min(1)).optional();

const educationEntry = z.object({
  institution: z.string().min(1),
  area: optionalText,
  degree: optionalText,
  start_date: dateValue.optional(),
  end_date: dateValue.optional(),
  location: optionalText,
  highlights,
});

const experienceEntry = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  start_date: dateValue.optional(),
  end_date: dateValue.optional(),
  location: optionalText,
  highlights,
});

const awardEntry = z.object({
  name: z.string().min(1),
  date: dateValue.optional(),
  location: optionalText,
  summary: optionalText,
  highlights,
});

const certificationEntry = z.object({
  name: z.string().min(1),
  date: dateValue.optional(),
  location: optionalText,
  summary: optionalText,
});

const skillEntry = z.object({
  label: z.string().min(1),
  details: z.string().min(1),
});

export const cvSchema = z.object({
  name: z.string().min(1),
  headline: optionalText,
  location: optionalText,
  email: optionalText,
  phone: optionalText,
  social_networks: z.array(socialNetwork).optional(),
  sections: z
    .object({
      education: z.array(educationEntry).optional(),
      experience: z.array(experienceEntry).optional(),
      awards: z.array(awardEntry).optional(),
      certifications: z.array(certificationEntry).optional(),
      skills: z.array(skillEntry).optional(),
    })
    .partial()
    .optional(),
});

export const cvDocumentSchema = z.object({ cv: cvSchema });

export type Cv = z.infer<typeof cvSchema>;
export type CvDocument = z.infer<typeof cvDocumentSchema>;

/** Section keys the web view model knows how to render. */
export const SECTION_KEYS = [
  "education",
  "experience",
  "awards",
  "certifications",
  "skills",
] as const;

const rawDocumentSchema = z.object({
  cv: z.object({
    sections: z.record(z.string(), z.unknown()).optional(),
  }),
});

/**
 * Parse a RenderCV YAML document into the shape the site renders.
 *
 * Unknown section keys are rejected rather than silently stripped: localized
 * documents use localized titles (`職歴`, `学歴`, …), and a silent strip would
 * render an empty page. The English document generated from `cv/source/cv.yaml`
 * is the only input this app accepts.
 */
export function parseCvYaml(text: string): CvDocument {
  if (text.trim() === "") {
    throw new Error("YAML must contain a top-level 'cv' mapping");
  }

  let data: unknown;
  try {
    data = yaml.load(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`CV YAML could not be parsed: ${reason}`);
  }

  const raw = rawDocumentSchema.safeParse(data);
  if (!raw.success) {
    throw new Error("YAML must contain a top-level 'cv' mapping");
  }

  const unknownKeys = Object.keys(raw.data.cv.sections ?? {}).filter(
    (key) => !(SECTION_KEYS as readonly string[]).includes(key),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      `Unsupported CV section key(s): ${unknownKeys.join(", ")}. ` +
        "The web app renders the generated English CV; localized section " +
        "titles belong in cv/source/cv.yaml.",
    );
  }

  return cvDocumentSchema.parse(data);
}
