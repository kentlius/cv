import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "zod";
import yaml from "js-yaml";

const socialNetwork = z.object({
  network: z.string(),
  username: z.string(),
});

const dateValue = z.union([z.string(), z.number()]).transform((v) =>
  typeof v === "number" ? String(v) : v,
);

const educationEntry = z.object({
  institution: z.string(),
  area: z.string().optional(),
  degree: z.string().optional(),
  start_date: dateValue.optional(),
  end_date: dateValue.optional(),
  location: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const experienceEntry = z.object({
  company: z.string(),
  position: z.string(),
  start_date: dateValue.optional(),
  end_date: dateValue.optional(),
  location: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const awardEntry = z.object({
  name: z.string(),
  date: dateValue.optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const certificationEntry = z.object({
  name: z.string(),
  date: dateValue.optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
});

const skillEntry = z.object({
  label: z.string(),
  details: z.string(),
});

const cv = z.object({
  name: z.string(),
  headline: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
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

const cvCollection = defineCollection({
  loader: file("../../cv/Kent_Liusudarso_CV.yaml", {
    parser: (text) => {
      const data = yaml.load(text) as { cv?: unknown };
      if (!data || typeof data !== "object" || !("cv" in data)) {
        throw new Error("YAML missing top-level 'cv' key");
      }
      return [{ id: "kent", ...data }];
    },
  }),
  schema: z.object({
    cv: cv,
  }),
});

export const collections = { cv: cvCollection };
