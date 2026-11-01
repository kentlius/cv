import type { Cv } from "./cv-schema";

export type ContactIcon = "mail" | "phone" | "linkedin" | "github" | "link";

export interface ContactView {
  href: string;
  title: string;
  newtab: boolean;
  icon: ContactIcon;
}

export interface ProfileView {
  name: string;
  headline?: string;
  locationLabel?: string;
  locationHref?: string;
  initials: string;
}

export interface ExperienceView {
  company: string;
  position: string;
  location?: string;
  dates: string;
  highlights: string[];
}

export interface EducationView {
  institution: string;
  location?: string;
  dates: string;
  credential?: string;
  highlights: string[];
}

export interface CertificationView {
  name: string;
  detail?: string;
  href?: string;
  date?: string;
  summary?: string;
}

export interface AwardView {
  name: string;
  href?: string;
  location?: string;
  date?: string;
  summary?: string;
  highlights: string[];
}

export interface SkillGroupView {
  label: string;
  items: string[];
}

export interface CvView {
  profile: ProfileView;
  contacts: ContactView[];
  experience: ExperienceView[];
  education: EducationView[];
  certifications: CertificationView[];
  awards: AwardView[];
  skills: SkillGroupView[];
}

const SOCIAL_URLS: Record<string, (username: string) => string> = {
  LinkedIn: (username) => `https://linkedin.com/in/${username}`,
  GitHub: (username) => `https://github.com/${username}`,
  Twitter: (username) => `https://x.com/${username}`,
  X: (username) => `https://x.com/${username}`,
  Instagram: (username) => `https://instagram.com/${username}`,
  YouTube: (username) => `https://youtube.com/@${username}`,
  Facebook: (username) => `https://facebook.com/${username}`,
  Website: (username) =>
    username.startsWith("http") ? username : `https://${username}`,
};

const NETWORK_ICONS: Record<string, ContactIcon> = {
  LinkedIn: "linkedin",
  GitHub: "github",
};

export function formatDate(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.toLowerCase() === "present") return "Present";

  const fullDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (fullDate) {
    const year = Number(fullDate[1]);
    const month = Number(fullDate[2]);
    const day = Number(fullDate[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return trimmed;
    }
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  const monthDate = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (monthDate) {
    const year = Number(monthDate[1]);
    const month = Number(monthDate[2]);
    if (month < 1 || month > 12) return trimmed;
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  if (/^\d{4}$/.test(trimmed)) return trimmed;
  return trimmed;
}

export function formatRange(
  start: string | undefined,
  end: string | undefined,
): string {
  const formattedStart = formatDate(start);
  const formattedEnd = formatDate(end);
  if (formattedStart && formattedEnd) return `${formattedStart} – ${formattedEnd}`;
  return formattedStart || formattedEnd;
}

export function isSafeHref(href: string): boolean {
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(href.trim());
  if (!scheme) return true;
  return ["http", "https", "mailto", "tel"].includes(scheme[1].toLowerCase());
}

export function socialUrl(network: string, username: string): string {
  const build = SOCIAL_URLS[network];
  return build ? build(username) : `https://${username}`;
}

export function parseMarkdownLink(
  text: string | undefined,
): { text: string; href: string } | null {
  if (!text) return null;
  const match = /^\[([^\]]+)\]\(([^)]+)\)\s*$/.exec(text.trim());
  if (!match) return null;
  const href = match[2].trim();
  return isSafeHref(href) ? { text: match[1].trim(), href } : null;
}

/**
 * Strip inline `[label](url)` syntax from a value while keeping the first safe
 * destination. Used for award names, where RenderCV permits inline links but
 * the web view renders a single anchor around the whole value.
 */
export function stripInlineMarkdownLinks(text: string): {
  text: string;
  href?: string;
} {
  const links = [...text.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];
  if (links.length === 0) return { text };

  const href = links
    .map((link) => link[2].trim())
    .find((candidate) => isSafeHref(candidate));

  const stripped = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  return href ? { text: stripped, href } : { text: stripped };
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts
    .map((part) => Array.from(part).find((character) => /\p{L}/u.test(character)))
    .filter((character): character is string => Boolean(character));
  return letters.slice(0, 2).join("").toUpperCase() || "?";
}

/**
 * Turn the validated CV document into everything the page renders.
 *
 * This is the only module that knows how CV fields become copy: dates,
 * destinations, parsed link text, and initials are derived once here so the
 * page and its section components stay layout-only.
 */
export function buildCvView(cv: Cv): CvView {
  const sections = cv.sections ?? {};

  const contacts: ContactView[] = [
    ...(cv.email
      ? [
          {
            href: `mailto:${cv.email}`,
            title: "Email",
            newtab: false,
            icon: "mail" as const,
          },
        ]
      : []),
    ...(cv.phone
      ? [
          {
            href: `tel:${cv.phone}`,
            title: "Phone",
            newtab: false,
            icon: "phone" as const,
          },
        ]
      : []),
    ...(cv.social_networks ?? []).map((social) => ({
      href: socialUrl(social.network, social.username),
      title: social.network,
      newtab: true,
      icon: NETWORK_ICONS[social.network] ?? ("link" as const),
    })),
  ];

  const locationLabel = cv.location;
  const locationHref = locationLabel
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`
    : undefined;

  const experience: ExperienceView[] = (sections.experience ?? []).map((job) => ({
    company: job.company,
    position: job.position,
    location: job.location,
    dates: formatRange(job.start_date, job.end_date),
    highlights: job.highlights ?? [],
  }));

  const education: EducationView[] = (sections.education ?? []).map((entry) => ({
    institution: entry.institution,
    location: entry.location,
    dates: formatRange(entry.start_date, entry.end_date),
    credential:
      [entry.degree, entry.area].filter(Boolean).join(" · ") || undefined,
    highlights: entry.highlights ?? [],
  }));

  const certifications: CertificationView[] = (
    sections.certifications ?? []
  ).map((certification) => {
    const link = parseMarkdownLink(certification.location);
    return {
      name: certification.name,
      href: link?.href,
      detail: link?.text ?? certification.location,
      date: certification.date ? formatDate(certification.date) : undefined,
      summary: certification.summary,
    };
  });

  const awards: AwardView[] = (sections.awards ?? []).map((award) => {
    const inline = stripInlineMarkdownLinks(award.name);
    const locationLink = parseMarkdownLink(award.location);
    return {
      name: inline.text,
      href: inline.href ?? locationLink?.href,
      location: locationLink?.text ?? award.location,
      date: award.date ? formatDate(award.date) : undefined,
      summary: award.summary,
      highlights: award.highlights ?? [],
    };
  });

  const skills: SkillGroupView[] = (sections.skills ?? []).map((group) => ({
    label: group.label,
    items: group.details
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  }));

  return {
    profile: {
      name: cv.name,
      headline: cv.headline,
      locationLabel,
      locationHref,
      initials: initialsOf(cv.name),
    },
    contacts,
    experience,
    education,
    certifications,
    awards,
    skills,
  };
}
