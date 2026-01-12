import type { Metadata } from "next";
import Link from "next/link";
import { JsonTool } from "../components/JsonTool";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description:
    "Free JSON formatter to pretty-print or minify JSON, explore it as a tree, and see array lengths/object sizes as you expand nodes.",
  alternates: {
    canonical: "https://awesomejson.vercel.app/json-formatter",
  },
};

const faqItems = [
  {
    question: "How do I pretty-print (format) JSON?",
    answer:
      "Paste JSON on the left, then click “Format input”. You can switch indentation between 2 or 4 spaces.",
  },
  {
    question: "How do I minify JSON?",
    answer: "Paste JSON on the left, then click “Minify input” to remove whitespace.",
  },
  {
    question: "Does this tool show array lengths and object sizes?",
    answer: "Yes. In Tree view you’ll see labels like Array(3) and Object(5) next to nodes.",
  },
] as const;

export default function JsonFormatterPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight">JSON Formatter</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Pretty-print or minify JSON, then explore the result in a collapsible tree with array lengths and object
            sizes.
          </p>
        </header>

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            When you’re working with large JSON payloads, readability is everything. This formatter helps you turn dense,
            minified JSON into a clean, consistent shape with one click. Switch between 2-space and 4-space indentation,
            and copy the pretty result when you’re ready to share it in a PR comment, a ticket, or a debugging thread.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            The differentiator here is the Tree view: instead of scanning a wall of text, you can expand/collapse nodes
            and immediately see how big each section is. Arrays are labeled with their length and objects show their key
            count, which makes it easy to spot unexpectedly large lists or missing fields.
          </p>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Explore related pages:{" "}
            <Link href="/json-parser" className="underline underline-offset-4">
              JSON Parser
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


