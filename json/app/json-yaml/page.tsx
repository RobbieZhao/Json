import { SideNav } from "../components/SideNav";
import { JsonYamlTool } from "../components/JsonYamlTool";

export default function JsonYamlPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl gap-4 px-4 py-6 sm:px-6">
        <div className="sticky top-6">
          <SideNav />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">JSON ⇄ YAML Converter</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Convert JSON to YAML or swap directions instantly. Choose indentation, load an example, and copy the result.
            </p>
          </header>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <JsonYamlTool />
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">About this converter</h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Paste JSON or YAML, pick the direction, and convert with one click. Swap directions to reuse the same inputs, or load the example to see supported structures like objects, arrays, booleans, and numbers.
            </p>
            <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Bidirectional: JSON → YAML or YAML → JSON</li>
              <li>Indent toggle for clean, readable output</li>
              <li>Error feedback when parsing fails</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

