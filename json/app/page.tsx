import Link from "next/link";
import { JsonTool } from "./components/JsonTool";

export default function Home() {
  // Server-rendered SEO shell + client-side tool below.
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            JSON Formatter with Array Lengths &amp; Tree View
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Paste JSON on the left. Explore the formatted result on the right (collapse/expand fields, and see array lengths).
          </p>
        </header>

        <ToolSection />

        <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Visual JSON Formatter with Array Counts</h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            AwesomeJSON helps you format and explore JSON using an interactive tree view. Expand/collapse fields as you
            navigate, and quickly understand nested payloads by seeing array lengths and object sizes at every level.
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Everything runs entirely in your browser; your JSON is not uploaded.
          </p>
          <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>Array lengths and object sizes shown inline</li>
            <li>Expand/collapse nodes to focus on what matters</li>
            <li>Format and minify JSON instantly</li>
            <li>Copy pretty JSON with one click</li>
            <li>Indentation toggle: 2 or 4 spaces</li>
          </ul>
        </section>

        <ExploreMore />
      </div>
    </div>
  );
}

function ToolSection() {
  return <JsonTool />;
}

function ExploreMore() {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold">Explore more</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/json-formatter"
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          JSON Formatter
        </Link>
        <Link
          href="/json-parser"
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          JSON Parser
        </Link>
        <Link
          href="/json-array-length"
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          JSON Array Lengths
        </Link>
      </div>
    </section>
  );
}
