import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: "https://awesomejson.vercel.app/",
      lastModified,
    },
    {
      url: "https://awesomejson.vercel.app/json-formatter",
      lastModified,
    },
    {
      url: "https://awesomejson.vercel.app/json-parser",
      lastModified,
    },
    {
      url: "https://awesomejson.vercel.app/json-array-length",
      lastModified,
    },
  ];
}


