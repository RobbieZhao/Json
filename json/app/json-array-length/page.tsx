import type { Metadata } from "next";
import Link from "next/link";
import { JsonTool } from "../components/JsonTool";

export const metadata: Metadata = {
  title: "JSON Array Lengths",
  description:
    "Visualize JSON arrays and instantly see array lengths and object sizes in a collapsible tree view. Helpful for debugging pagination and nested data.",
  alternates: {
    canonical: "https://awesomejson.vercel.app/json-array-length",
  },
};

const faqItems = [
  {
    question: "Does this tool show array lengths?",
    answer: "Yes. In Tree view, arrays show a badge like Array(10) so you can see the element count at a glance.",
  },
  {
    question: "Does it show object sizes too?",
    answer: "Yes. Objects show Object(n), where n is the number of keys in that object.",
  },
  {
    question: "Why is counting array elements useful?",
    answer: "It helps spot pagination issues, unexpected payload sizes, and empty lists without manually scanning the JSON.",
  },
] as const;

export default function JsonArrayLengthPage() {
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
          <h1 className="text-2xl font-semibold tracking-tight">JSON Array Lengths (with Tree View)</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            See how many items are in each array, plus object key counts, while you expand/collapse nested JSON.
          </p>
        </header>

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Counting elements inside JSON arrays is a surprisingly common debugging task. When an API response looks
            wrong, you often want to know: “How many items did I actually receive?” or “Which nested array is empty?”
            AwesomeJSON makes that obvious by labeling every array node with its length (for example, Array(25)) and
            every object with its key count (for example, Object(8)).
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            This is especially useful for pagination and filtering issues. If page 2 accidentally returns page 1 data,
            the counts will look suspiciously identical. If a backend bug drops items, you’ll immediately see smaller
            array lengths. Combine that with the collapsible Tree view and you can navigate straight to the list you
            care about, instead of scrolling through a huge formatted document.
          </p>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            Explore related pages:{" "}
            <Link href="/json-formatter" className="underline underline-offset-4">
              JSON Formatter
            </Link>
            {" · "}
            <Link href="/json-parser" className="underline underline-offset-4">
              JSON Parser
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


