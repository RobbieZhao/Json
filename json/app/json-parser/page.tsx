import type { Metadata } from "next";
import Link from "next/link";
import { JsonTool } from "../components/JsonTool";

export const metadata: Metadata = {
  title: "JSON Parser",
  description:
    "Free online JSON parser to validate JSON, detect if it’s valid, and explore its structure with a collapsible tree and array lengths.",
  alternates: {
    canonical: "https://awesomejson.vercel.app/json-parser",
  },
};

const faqItems = [
  {
    question: "How do I know if my JSON is valid?",
    answer: "When your input parses successfully, the tool shows “Valid JSON” above the input editor.",
  },
  {
    question: "What causes invalid JSON most often?",
    answer: "Common issues include trailing commas, using single quotes, unquoted keys, or comments (JSON doesn’t allow them).",
  },
  {
    question: "Does the parser show where the error is?",
    answer: "When parsing fails, an error message is shown and may include a character position.",
  },
] as const;

export default function JsonParserPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />

        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">JSON Parser</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Validate JSON and explore the parsed result in a collapsible tree. Great for debugging API responses and
            config files.
          </p>
        </header>

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            JSON is strict: one small typo can break an entire payload. This page provides a fast JSON parser so you can
            paste text and immediately detect whether it’s valid. If parsing succeeds, you’ll see a “Valid JSON”
            indicator and you can inspect the parsed structure. If parsing fails, you’ll see an error message and (when
            available) a position that helps you locate the issue.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            The Tree view is especially helpful when the JSON is deeply nested. Expand and collapse nodes to find the
            part you care about, and use the array length and object size badges to quickly understand how much data you
            received. This makes it easier to spot unexpected list sizes (for example, a pagination bug returning too
            many items) or missing keys in objects.
          </p>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Explore related pages:{" "}
            <Link href="/json-formatter" className="underline underline-offset-4">
              JSON Formatter
            </Link>
            {" · "}
            <Link href="/json-array-length" className="underline underline-offset-4">
              JSON Array Lengths
            </Link>
          </div>
        </section>

        <JsonTool />

        <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <div className="mt-3 flex flex-col gap-4">
            {faqItems.map((f) => (
              <div key={f.question}>
                <div className="font-medium">{f.question}</div>
                <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{f.answer}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


