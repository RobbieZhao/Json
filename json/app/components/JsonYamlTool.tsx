"use client";

import React from "react";
import YAML from "yaml";

type Direction = "jsonToYaml" | "yamlToJson";

const EXAMPLE_JSON = `{
  "service": "payments",
  "enabled": true,
  "retries": 3,
  "thresholds": { "warn": 120, "error": 300 },
  "regions": ["us-east-1", "eu-west-1"]
}`;

const EXAMPLE_YAML = `service: payments
enabled: true
retries: 3
thresholds:
  warn: 120
  error: 300
regions:
  - us-east-1
  - eu-west-1
`;

export function JsonYamlTool() {
  const [direction, setDirection] = React.useState<Direction>("jsonToYaml");
  const [input, setInput] = React.useState<string>(EXAMPLE_JSON);
  const [output, setOutput] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [indent, setIndent] = React.useState<2 | 4>(2);

  const isJsonToYaml = direction === "jsonToYaml";
  const sourceLabel = isJsonToYaml ? "JSON input" : "YAML input";
  const targetLabel = isJsonToYaml ? "YAML output" : "JSON output";

  const performConvert = React.useCallback(
    (source: string, dir: Direction, ind: 2 | 4) => {
      try {
        let result: string;
        if (dir === "jsonToYaml") {
          const parsed = JSON.parse(source);
          result = YAML.stringify(parsed, { indent: ind });
        } else {
          const parsed = YAML.parse(source);
          result = JSON.stringify(parsed, null, ind);
        }
        setOutput(result);
        setError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Conversion failed";
        setError(msg);
        setOutput("");
      }
    },
    [],
  );

  const convert = React.useCallback(() => {
    try {
      let result: string;
      if (isJsonToYaml) {
        const parsed = JSON.parse(input);
        result = YAML.stringify(parsed, { indent });
      } else {
        const parsed = YAML.parse(input);
        result = JSON.stringify(parsed, null, indent);
      }
      setOutput(result);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Conversion failed";
      setError(msg);
      setOutput("");
    }
  }, [input, isJsonToYaml, indent]);

  const swapDirection = () => {
    setDirection((prev) => (prev === "jsonToYaml" ? "yamlToJson" : "jsonToYaml"));
    setOutput("");
    setError(null);
    setInput((prev) => {
      // Swap current panes: move rendered output into the new source box when available.
      if (output) return output;
      // Fallback to a sensible example when no output yet.
      return prev === EXAMPLE_JSON ? EXAMPLE_YAML : EXAMPLE_JSON;
    });
  };

  const loadExample = () => {
    const sample = isJsonToYaml ? EXAMPLE_JSON : EXAMPLE_YAML;
    setInput(sample);
    setOutput("");
    setError(null);
    performConvert(sample, direction, indent);
  };

  React.useEffect(() => {
    convert();
  }, [convert]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
          {isJsonToYaml ? "Direction: JSON → YAML" : "Direction: YAML → JSON"}
        </div>

        <button
          type="button"
          onClick={loadExample}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Load example
        </button>

        <button
          type="button"
          onClick={swapDirection}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Swap
        </button>

        <div className="inline-flex overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setIndent(2)}
            className={[
              "px-3 py-1.5 text-sm",
              indent === 2
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            2 spaces
          </button>
          <button
            type="button"
            onClick={() => setIndent(4)}
            className={[
              "px-3 py-1.5 text-sm",
              indent === 4
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
            ].join(" ")}
          >
            4 spaces
          </button>
        </div>

      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-100">
          <div className="font-semibold">Conversion failed</div>
          <div className="text-xs mt-1">{error}</div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{sourceLabel}</h3>
            <button
              type="button"
              onClick={() => {
                setInput("");
                setError(null);
              }}
              className="text-xs text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-72 w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] leading-6 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-700"
            placeholder={isJsonToYaml ? 'e.g. {"hello":"world"}' : "e.g.\nhello: world"}
            aria-label={sourceLabel}
          />
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{targetLabel}</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Read-only</span>
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            className="h-72 w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[13px] leading-6 text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="Converted result will appear here"
            aria-label={targetLabel}
          />
        </section>
      </div>
    </div>
  );
}

