import assert from "node:assert/strict";
import { test } from "node:test";

import type { Cv } from "../src/lib/cv-schema.ts";
import {
  buildCvView,
  formatDate,
  formatRange,
  initialsOf,
  isSafeHref,
  parseMarkdownLink,
  socialUrl,
  stripInlineMarkdownLinks,
} from "../src/lib/cv-view.ts";

const fixture: Cv = {
  name: "Kent Liusudarso",
  headline: "Software engineer",
  location: "Shizuoka, Japan",
  email: "kent@example.com",
  phone: "+81-70-0000-0000",
  social_networks: [
    { network: "LinkedIn", username: "kentlius" },
    { network: "GitHub", username: "kentlius" },
    { network: "Mastodon", username: "kent@example.social" },
  ],
  sections: {
    experience: [
      {
        company: "Toyota Motor East Japan",
        position: "Software Engineer",
        start_date: "2025-08",
        end_date: "present",
        location: "Shizuoka, Japan",
        highlights: ["Shipped a thing"],
      },
    ],
    education: [
      {
        institution: "Institut Teknologi Bandung",
        degree: "BS",
        area: "Computer Science",
        start_date: "2020",
        end_date: "2024",
        highlights: [],
      },
    ],
    certifications: [
      {
        name: "AWS Certified",
        location: "[Credential](https://example.com/credential)",
        date: "2024-05",
        summary: "Cloud fundamentals",
      },
    ],
    awards: [
      {
        name: "Best Project",
        location: "[Honor](https://example.com/award)",
        date: "2023",
        summary: "Recognized for delivery",
        highlights: ["Top 3"],
      },
    ],
    skills: [
      { label: "Languages", details: "TypeScript, Go , ,Python" },
    ],
  },
};

test("formats dates the way the page renders them", () => {
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate(""), "");
  assert.equal(formatDate("present"), "Present");
  assert.equal(formatDate("PRESENT"), "Present");
  assert.equal(formatDate("2024-03"), "Mar 2024");
  assert.equal(formatDate("2024-03-15"), "Mar 15, 2024");
  assert.equal(formatDate("2020"), "2020");
  assert.equal(formatDate("Remote"), "Remote");
});

test("rejects impossible calendar dates instead of rolling them over", () => {
  assert.equal(formatDate("2024-13"), "2024-13");
  assert.equal(formatDate("2024-00"), "2024-00");
  assert.equal(formatDate("2024-02-31"), "2024-02-31");
});

test("strips inline markdown links while keeping a safe destination", () => {
  assert.deepEqual(
    stripInlineMarkdownLinks(
      "Digihatch Hackathon [(Dexa Group)](https://www.dexagroup.com/) - Logistics",
    ),
    {
      text: "Digihatch Hackathon (Dexa Group) - Logistics",
      href: "https://www.dexagroup.com/",
    },
  );
  assert.deepEqual(stripInlineMarkdownLinks("Best Project"), {
    text: "Best Project",
  });
});

test("rejects unsafe link destinations", () => {
  assert.equal(parseMarkdownLink("[Bad](javascript:alert)"), null);
  assert.equal(isSafeHref("javascript:alert"), false);
  assert.equal(isSafeHref("/cv"), true);
  assert.equal(isSafeHref("https://example.com"), true);
  assert.equal(isSafeHref("relative/path"), true);
  assert.deepEqual(stripInlineMarkdownLinks("[Bad](javascript:alert)"), {
    text: "Bad",
  });
});

test("formats ranges across every presence combination", () => {
  assert.equal(formatRange("2025-08", "present"), "Aug 2025 – Present");
  assert.equal(formatRange("2025-08", undefined), "Aug 2025");
  assert.equal(formatRange(undefined, "2024-03"), "Mar 2024");
  assert.equal(formatRange(undefined, undefined), "");
});

test("resolves social destinations through one registry", () => {
  assert.equal(socialUrl("LinkedIn", "kentlius"), "https://linkedin.com/in/kentlius");
  assert.equal(socialUrl("GitHub", "kentlius"), "https://github.com/kentlius");
  assert.equal(socialUrl("X", "kentlius"), "https://x.com/kentlius");
  assert.equal(socialUrl("Website", "kent.dev"), "https://kent.dev");
  assert.equal(socialUrl("Website", "https://kent.dev"), "https://kent.dev");
  assert.equal(socialUrl("Untracked", "kentlius"), "https://kentlius");
});

test("parses RenderCV's markdown-link fields", () => {
  assert.deepEqual(parseMarkdownLink("[Credential](https://example.com)"), {
    text: "Credential",
    href: "https://example.com",
  });
  assert.deepEqual(parseMarkdownLink("  [A](b)  "), { text: "A", href: "b" });
  assert.equal(parseMarkdownLink("Plain text"), null);
  assert.equal(parseMarkdownLink(undefined), null);
});

test("derives initials from the name", () => {
  assert.equal(initialsOf("Kent Liusudarso"), "KL");
  assert.equal(initialsOf("Kent"), "K");
  assert.equal(initialsOf("Kent Aditya Bima Liusudarso"), "KA");
  assert.equal(initialsOf("🦊 Fox"), "F");
  assert.equal(initialsOf("👩🏽‍💻 Priya"), "P");
  assert.equal(initialsOf("王秀英"), "王");
  assert.equal(initialsOf("   "), "?");
});

test("builds every section from the document in one pass", () => {
  const view = buildCvView(fixture);

  assert.equal(view.profile.name, "Kent Liusudarso");
  assert.equal(view.profile.headline, "Software engineer");
  assert.equal(view.profile.locationLabel, "Shizuoka, Japan");
  assert.equal(
    view.profile.locationHref,
    "https://www.google.com/maps/search/?api=1&query=Shizuoka%2C%20Japan",
  );
  assert.equal(view.profile.initials, "KL");

  assert.deepEqual(
    view.contacts.map(({ title, icon, newtab, href }) => ({ title, icon, newtab, href })),
    [
      {
        title: "Email",
        icon: "mail",
        newtab: false,
        href: "mailto:kent@example.com",
      },
      {
        title: "Phone",
        icon: "phone",
        newtab: false,
        href: "tel:+81-70-0000-0000",
      },
      {
        title: "LinkedIn",
        icon: "linkedin",
        newtab: true,
        href: "https://linkedin.com/in/kentlius",
      },
      {
        title: "GitHub",
        icon: "github",
        newtab: true,
        href: "https://github.com/kentlius",
      },
      {
        title: "Mastodon",
        icon: "link",
        newtab: true,
        href: "https://kent@example.social",
      },
    ],
  );

  assert.deepEqual(view.experience, [
    {
      company: "Toyota Motor East Japan",
      position: "Software Engineer",
      location: "Shizuoka, Japan",
      dates: "Aug 2025 – Present",
      highlights: ["Shipped a thing"],
    },
  ]);

  assert.deepEqual(view.education, [
    {
      institution: "Institut Teknologi Bandung",
      location: undefined,
      dates: "2020 – 2024",
      credential: "BS · Computer Science",
      highlights: [],
    },
  ]);

  assert.deepEqual(view.certifications, [
    {
      name: "AWS Certified",
      href: "https://example.com/credential",
      detail: "Credential",
      date: "May 2024",
      summary: "Cloud fundamentals",
    },
  ]);

  assert.deepEqual(view.awards, [
    {
      name: "Best Project",
      href: "https://example.com/award",
      location: "Honor",
      date: "2023",
      summary: "Recognized for delivery",
      highlights: ["Top 3"],
    },
  ]);

  assert.deepEqual(view.skills, [
    { label: "Languages", items: ["TypeScript", "Go", "Python"] },
  ]);
});

test("empty documents produce empty sections and no contacts", () => {
  const view = buildCvView({ name: "Solo" });

  assert.equal(view.profile.initials, "S");
  assert.equal(view.profile.locationHref, undefined);
  assert.deepEqual(view.contacts, []);
  assert.deepEqual(view.experience, []);
  assert.deepEqual(view.education, []);
  assert.deepEqual(view.certifications, []);
  assert.deepEqual(view.awards, []);
  assert.deepEqual(view.skills, []);
});
