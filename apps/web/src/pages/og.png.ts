import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { getCv } from "@/lib/cv-source";
import { buildCvView } from "@/lib/cv-view";

export const prerender = true;

const globeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520" fill="none">
  <circle cx="260" cy="260" r="248" stroke="#171717" stroke-opacity="0.14"/>
  <ellipse cx="260" cy="260" rx="96" ry="248" stroke="#171717" stroke-opacity="0.14"/>
  <ellipse cx="260" cy="260" rx="184" ry="248" stroke="#171717" stroke-opacity="0.14"/>
  <path d="M12 260h496" stroke="#171717" stroke-opacity="0.14"/>
  <path d="M52 150h416M52 370h416" stroke="#171717" stroke-opacity="0.08"/>
  <circle cx="360" cy="188" r="7" fill="#171717"/>
</svg>`;

const globeSrc = `data:image/svg+xml;base64,${Buffer.from(globeSvg).toString("base64")}`;

export const GET: APIRoute = async () => {
  const cv = await getCv();
  const view = buildCvView(cv);
  const role = view.experience[0]?.position ?? "Software Engineer";
  const company = view.experience[0]?.company ?? "";
  const location = view.profile.locationLabel ?? "";
  const footer = ["cv.kntl.zip", location].filter(Boolean).join(" · ");

  const fontDir = join(process.cwd(), "src/assets/fonts/og");
  const [sans, mono] = await Promise.all([
    readFile(join(fontDir, "instrument-sans-700.ttf")),
    readFile(join(fontDir, "geist-mono-400.ttf")),
  ]);

  const tree = {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        width: "1200px",
        height: "630px",
        padding: "64px",
        overflow: "hidden",
        background: "#ffffff",
        color: "#171717",
        fontFamily: "Instrument Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: "18px",
              letterSpacing: "0.04em",
              color: "#737373",
            },
            children: "CURRICULUM VITAE",
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "32px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    maxWidth: "660px",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          fontSize: "96px",
                          fontWeight: 700,
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                        },
                        children: view.profile.name,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          fontFamily: "Geist Mono",
                          fontSize: "28px",
                          lineHeight: 1.3,
                          color: "#404040",
                        },
                        children: role,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          fontFamily: "Geist Mono",
                          fontSize: "20px",
                          color: "#737373",
                        },
                        children: company,
                      },
                    },
                  ],
                },
              },
              {
                type: "img",
                props: {
                  src: globeSrc,
                  width: 360,
                  height: 360,
                  style: {
                    width: "360px",
                    height: "360px",
                    flexShrink: 0,
                  },
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              width: "100%",
              paddingTop: "20px",
              borderTop: "1px solid #e5e5e5",
              fontFamily: "Geist Mono",
              fontSize: "18px",
              color: "#737373",
            },
            children: footer,
          },
        },
      ],
    },
  };

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Instrument Sans",
        data: sans.buffer.slice(
          sans.byteOffset,
          sans.byteOffset + sans.byteLength,
        ) as ArrayBuffer,
        weight: 700,
        style: "normal",
      },
      {
        name: "Geist Mono",
        data: mono.buffer.slice(
          mono.byteOffset,
          mono.byteOffset + mono.byteLength,
        ) as ArrayBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  })
    .render()
    .asPng();

  return new Response(png as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
