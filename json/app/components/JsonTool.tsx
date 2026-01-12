"use client";

import React from "react";
import { JsonPretty } from "./JsonPretty";
import { JsonTree, type JsonTreeHandle } from "./JsonTree";
import { formatJson, parseJson } from "../utils/json";

const EXAMPLE = `{
  "user": { "id": 123, "name": "Ava", "active": true },
  "roles": ["admin", "editor", "viewer"],
  "projects": [
    { "name": "Alpha", "tags": ["a", "b"] },
    { "name": "Beta", "tags": [] }
  ],
  "meta": null
}`;

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function JsonTool() {
  const [input, setInput] = React.useState<string>(EXAMPLE);
  const [activeRightTab, setActiveRightTab] = React.useState<"tree" | "pretty">("pretty");
  const [copyState, setCopyState] = React.useState<"idle" | "copied">("idle");
  const [indentSize, setIndentSize] = React.useState<2 | 4>(4);
  const treeRef = React.useRef<JsonTreeHandle | null>(null);

  const parsed = React.useMemo(() => parseJson(input), [input]);
  const pretty = React.useMemo(() => {
    if (!parsed.ok) return null;
    return formatJson(parsed.value, indentSize);
  }, [parsed, indentSize]);

  const onCopyPretty = async () => {
    if (!pretty) return;
    await copyToClipboard(pretty);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 900);
  };

  const onFormatInput = () => {
    if (!pretty) return;
    setInput(pretty);
  };

  const onMinifyInput = () => {
    if (!parsed.ok) return;
    setInput(JSON.stringify(parsed.value));
  };

  return (
    <div className="flex flex-col gap-4">
      <main className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Input</h2>
              <div className="text-xs text-zinc-500">{parsed.ok ? "Valid JSON" : "Invalid JSON"}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setInput(EXAMPLE)}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Load example
              </button>
              <button
                type="button"
                onClick={onFormatInput}
                disabled={!parsed.ok}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Format input
              </button>
              <button
                type="button"
                onClick={onMinifyInput}
                disabled={!parsed.ok}
                className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                Minify input
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-[70vh] w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] leading-6 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-700"
            placeholder='e.g. {"hello":"world"}'
          />
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Output</h2>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveRightTab("pretty")}
                  className={[
                    "px-3 py-1.5 text-sm",
                    activeRightTab === "pretty"
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
                  ].join(" ")}
                >
                  Pretty
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRightTab("tree")}
                  disabled={!pretty}
                  className={[
                    "px-3 py-1.5 text-sm disabled:opacity-50",
                    activeRightTab === "tree"
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
                  ].join(" ")}
                >
                  Tree
                </button>
              </div>

              {activeRightTab === "tree" ? (
                <div className="inline-flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => treeRef.current?.expandAll()}
                    disabled={!parsed.ok}
                    className="px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Expand all
                  </button>
                  <button
                    type="button"
                    onClick={() => treeRef.current?.collapseAll()}
                    disabled={!parsed.ok}
                    className="px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                  >
                    Collapse all
                  </button>
                </div>
              ) : null}

              {activeRightTab === "pretty" ? (
                <>
                  <div className="inline-flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setIndentSize(4)}
                      className={[
                        "px-3 py-1.5 text-sm",
                        indentSize === 4
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                          : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
                      ].join(" ")}
                      aria-pressed={indentSize === 4}
                    >
                      4 spaces
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndentSize(2)}
                      className={[
                        "px-3 py-1.5 text-sm",
                        indentSize === 2
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                          : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
                      ].join(" ")}
                      aria-pressed={indentSize === 2}
                    >
                      2 spaces
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={onCopyPretty}
                    disabled={!pretty}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                  >
                    {copyState === "copied" ? "Copied" : "Copy pretty"}
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {!parsed.ok ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              <div className="font-medium">Couldn’t parse JSON</div>
              <div className="mt-1 text-xs opacity-90">{parsed.errorMessage}</div>
              {typeof parsed.position === "number" ? (
                <div className="mt-1 text-xs opacity-90">Position: {parsed.position}</div>
              ) : null}
            </div>
          ) : activeRightTab === "tree" ? (
            <div className="h-[70vh] overflow-auto">
              <JsonTree ref={treeRef} value={parsed.value} showControls={false} />
            </div>
          ) : (
            <JsonPretty value={pretty ?? ""} />
          )}
        </section>
      </main>
    </div>
  );
}


