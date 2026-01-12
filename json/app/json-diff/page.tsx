import { SideNav } from "../components/SideNav";
import { JsonDiffTool } from "../components/JsonDiffTool";

export default function JsonDiffPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl gap-4 px-4 py-6 sm:px-6">
        <div className="sticky top-6">
          <SideNav />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">JSON Diff</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Compare two JSON documents side-by-side with colored highlights for missing and unequal values.
            </p>
          </header>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <JsonDiffTool />
          </section>
        </div>
      </div>
    </div>
  );
}

