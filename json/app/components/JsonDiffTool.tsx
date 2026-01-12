"use client";

import React from "react";
import { formatJson, isJsonArray, isJsonObject, parseJson, type Json } from "../utils/json";

type DiffStatus = "equal" | "leftOnly" | "rightOnly" | "changed";

type DiffMaps = {
  left: Map<string, DiffStatus>;
  right: Map<string, DiffStatus>;
  counts: {
    leftOnly: number;
    rightOnly: number;
    changed: number;
  };
};

type RenderFlags = {
  showMissing: boolean;
  showChanged: boolean;
};

const EXAMPLE_LEFT = `{
  "active": true,
  "id": 101,
  "name": "Alice Kim",
  "preferences": {
    "notifications": [
      "email",
      "push"
    ],
    "theme": "dark"
  },
  "role": "editor",
  "tags": [
    "beta",
    "team-a"
  ]
}`;

const EXAMPLE_RIGHT = `{
  "active": false,
  "id": 102,
  "name": "Alice Kim",
  "preferences": {
    "notifications": [
      "email"
    ],
    "theme": "light"
  },
  "role": "editor",
  "tags": [
    "beta"
  ]
}`;

const INDENT = "  ";

function pathToId(path: Array<string | number>) {
  if (path.length === 0) return "$";
  let out = "$";
  for (const segment of path) {
    if (typeof segment === "number") {
      out += `[${segment}]`;
    } else if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) {
      out += `.${segment}`;
    } else {
      out += `[${JSON.stringify(segment)}]`;
    }
  }
  return out;
}

function deepEqual(a: Json, b: Json): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (isJsonArray(a) && isJsonArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i] as Json, b[i] as Json)) return false;
    }
    return true;
  }
  if (isJsonObject(a) && isJsonObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!(key in b)) return false;
      if (!deepEqual(a[key] as Json, b[key] as Json)) return false;
    }
    return true;
  }
  return false;
}

function normalizeJson(value: Json): Json {
  if (isJsonArray(value)) {
    return value.map((v) => normalizeJson(v)) as Json;
  }
  if (isJsonObject(value)) {
    return Object.fromEntries(
      Object.keys(value)
        .sort((a, b) => a.localeCompare(b))
        .map((k) => [k, normalizeJson(value[k] as Json)]),
    );
  }
  return value;
}

function setStatus(map: Map<string, DiffStatus>, id: string, status: DiffStatus) {
  const prev = map.get(id);
  if (!prev || prev === "equal") {
    map.set(id, status);
    return;
  }
  // Escalate: missing beats equal, changed beats missing when both sides exist.
  if (status === "changed") {
    map.set(id, "changed");
  } else if (prev === "leftOnly" || prev === "rightOnly") {
    map.set(id, prev);
  }
}

function walkDiff(
  left: Json | undefined,
  right: Json | undefined,
  path: Array<string | number>,
  leftMap: Map<string, DiffStatus>,
  rightMap: Map<string, DiffStatus>,
) {
  const id = pathToId(path);

  if (left === undefined && right === undefined) return;
  if (left === undefined) {
    setStatus(rightMap, id, "rightOnly");
    if (right !== undefined && isJsonArray(right)) {
      right.forEach((v, i) => walkDiff(undefined, v as Json, [...path, i], leftMap, rightMap));
    } else if (right !== undefined && isJsonObject(right)) {
      for (const [k, v] of Object.entries(right)) {
        walkDiff(undefined, v as Json, [...path, k], leftMap, rightMap);
      }
    }
    return;
  }
  if (right === undefined) {
    setStatus(leftMap, id, "leftOnly");
    if (left !== undefined && isJsonArray(left)) {
      left.forEach((v, i) => walkDiff(v as Json, undefined, [...path, i], leftMap, rightMap));
    } else if (left !== undefined && isJsonObject(left)) {
      for (const [k, v] of Object.entries(left)) {
        walkDiff(v as Json, undefined, [...path, k], leftMap, rightMap);
      }
    }
    return;
  }

  if (deepEqual(left, right)) return;

  setStatus(leftMap, id, "changed");
  setStatus(rightMap, id, "changed");

  if (isJsonArray(left) && isJsonArray(right)) {
    const max = Math.max(left.length, right.length);
    for (let i = 0; i < max; i++) {
      walkDiff(left[i] as Json, right[i] as Json, [...path, i], leftMap, rightMap);
    }
    return;
  }

  if (isJsonObject(left) && isJsonObject(right)) {
    const keys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)])).sort();
    for (const key of keys) {
      walkDiff(left[key] as Json, right[key] as Json, [...path, key], leftMap, rightMap);
    }
  }
}

function computeDiff(left: Json, right: Json): DiffMaps {
  const leftMap = new Map<string, DiffStatus>();
  const rightMap = new Map<string, DiffStatus>();

  walkDiff(left, right, [], leftMap, rightMap);

  // Root-level flag isn't very helpful visually.
  leftMap.delete("$");
  rightMap.delete("$");

  const counts = { leftOnly: 0, rightOnly: 0, changed: 0 };
  leftMap.forEach((status) => {
    if (status === "leftOnly") counts.leftOnly += 1;
    if (status === "changed") counts.changed += 1;
  });
  rightMap.forEach((status) => {
    if (status === "rightOnly") counts.rightOnly += 1;
    if (status === "changed") counts.changed += 0; // already counted from left
  });

  return { left: leftMap, right: rightMap, counts };
}

function lineClass(status: DiffStatus | undefined, flags: RenderFlags) {
  const shouldHighlightMissing = flags.showMissing && (status === "leftOnly" || status === "rightOnly");
  const shouldHighlightChanged = flags.showChanged && status === "changed";
  if (!shouldHighlightMissing && !shouldHighlightChanged) {
    return "whitespace-pre-wrap font-mono text-[13px] leading-6 px-2";
  }

  if (status === "leftOnly") {
    return "whitespace-pre-wrap font-mono text-[13px] leading-6 px-2 rounded border border-emerald-100 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100";
  }
  if (status === "rightOnly") {
    return "whitespace-pre-wrap font-mono text-[13px] leading-6 px-2 rounded border border-amber-100 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100";
  }
  return "whitespace-pre-wrap font-mono text-[13px] leading-6 px-2 rounded border border-sky-100 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-100";
}

function formatScalar(value: Json) {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null) return "null";
  return Array.isArray(value) ? "[…]" : "{…}";
}

function renderValue(
  value: Json,
  path: Array<string | number>,
  statusMap: Map<string, DiffStatus>,
  indentLevel: number,
  flags: RenderFlags,
  isLast: boolean,
  keyLabel?: string,
): React.ReactNode {
  if (isJsonArray(value)) {
    const id = pathToId(path);
    const prefix = keyLabel ? `"${keyLabel}": ` : "";
    const header = `${INDENT.repeat(indentLevel)}${prefix}[`;
    const footer = `${INDENT.repeat(indentLevel)}]${isLast ? "" : ","}`;
    const entries = value.map((entry, idx) =>
      renderValue(entry, [...path, idx], statusMap, indentLevel + 1, flags, idx === value.length - 1),
    );
    return (
      <React.Fragment key={id}>
        <div className={lineClass(statusMap.get(id), flags)}>{header}</div>
        {entries}
        <div className="whitespace-pre-wrap font-mono text-[13px] leading-6 px-2">{footer}</div>
      </React.Fragment>
    );
  }

  if (isJsonObject(value)) {
    const id = pathToId(path);
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const prefix = keyLabel ? `"${keyLabel}": ` : "";
    const header = `${INDENT.repeat(indentLevel)}${prefix}{`;
    const footer = `${INDENT.repeat(indentLevel)}}${isLast ? "" : ","}`;
    return (
      <React.Fragment key={id}>
        <div className={lineClass(statusMap.get(id), flags)}>{header}</div>
        {keys.map((key, idx) => {
          const child = value[key] as Json;
          const childPath = [...path, key];
          const isChildLast = idx === keys.length - 1;

          return renderValue(child, childPath, statusMap, indentLevel + 1, flags, isChildLast, key);
        })}
        <div className="whitespace-pre-wrap font-mono text-[13px] leading-6 px-2">{footer}</div>
      </React.Fragment>
    );
  }

  const id = pathToId(path);
  const prefix = keyLabel ? `"${keyLabel}": ` : "";
  const line = `${INDENT.repeat(indentLevel)}${prefix}${formatScalar(value)}${isLast ? "" : ","}`;
  return (
    <div key={id} className={lineClass(statusMap.get(id), flags)}>
      {line}
    </div>
  );
}

function DiffColumn({
  title,
  parsed,
  statusMap,
  flags,
}: {
  title: string;
  parsed: ReturnType<typeof parseJson>;
  statusMap: Map<string, DiffStatus>;
  flags: RenderFlags;
}) {
  if (!parsed.ok) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-100">
        <div className="font-semibold">{title} not valid JSON</div>
        <div className="text-xs mt-1">{parsed.errorMessage}</div>
      </div>
    );
  }

  const normalized = normalizeJson(parsed.value);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{title}</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {statusMap.size ? "Differences highlighted" : "No differences"}
        </div>
      </div>
      <div className="h-[60vh] overflow-auto rounded-lg border border-zinc-200 bg-white py-2 dark:border-zinc-800 dark:bg-black">
        {renderValue(normalized, [], statusMap, 0, flags, true)}
      </div>
    </div>
  );
}

export function JsonDiffTool() {
  const [leftInput, setLeftInput] = React.useState(EXAMPLE_LEFT);
  const [rightInput, setRightInput] = React.useState(EXAMPLE_RIGHT);
  const [showMissing, setShowMissing] = React.useState(true);
  const [showChanged, setShowChanged] = React.useState(true);

  const leftParsed = React.useMemo(() => parseJson(leftInput), [leftInput]);
  const rightParsed = React.useMemo(() => parseJson(rightInput), [rightInput]);

  const diff = React.useMemo(() => {
    if (!leftParsed.ok || !rightParsed.ok) return null;
    return computeDiff(leftParsed.value, rightParsed.value);
  }, [leftParsed, rightParsed]);

  const flags = React.useMemo(() => ({ showMissing, showChanged }), [showMissing, showChanged]);

  const onLoadExample = () => {
    setLeftInput(EXAMPLE_LEFT);
    setRightInput(EXAMPLE_RIGHT);
  };

  const onFormatBoth = () => {
    if (!leftParsed.ok || !rightParsed.ok) return;
    setLeftInput(formatJson(normalizeJson(leftParsed.value), 2));
    setRightInput(formatJson(normalizeJson(rightParsed.value), 2));
  };

  const counts = diff?.counts ?? { leftOnly: 0, rightOnly: 0, changed: 0 };
  const totalMissing = counts.leftOnly + counts.rightOnly;

  return (
    <div className="flex flex-col gap-4" id="json-diff">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">JSON Diff</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Compare two JSON documents side-by-side with colored highlights for missing and unequal values.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onLoadExample}
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Load example
          </button>
          <button
            type="button"
            onClick={onFormatBoth}
            disabled={!leftParsed.ok || !rightParsed.ok}
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Format both
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-sm border border-emerald-200 bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-900/60" />
            <span>Missing on right: {counts.leftOnly}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-sm border border-amber-200 bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/60" />
            <span>Missing on left: {counts.rightOnly}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-sm border border-sky-200 bg-sky-100 dark:border-sky-900/40 dark:bg-sky-900/60" />
            <span>Unequal values: {counts.changed}</span>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showMissing}
                onChange={(e) => setShowMissing(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <span>Show missing properties</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showChanged}
                onChange={(e) => setShowChanged(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <span>Show unequal values</span>
            </label>
            <div className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {diff ? `${totalMissing + counts.changed} differences` : "Waiting for valid JSON"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Left JSON</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {leftParsed.ok ? "Valid JSON" : "Invalid JSON"}
            </span>
          </div>
          <textarea
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value)}
            spellCheck={false}
            className="h-48 w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] leading-6 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-700"
            aria-label="Left JSON input"
          />
          <DiffColumn title="Left preview" parsed={leftParsed} statusMap={diff?.left ?? new Map()} flags={flags} />
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Right JSON</h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {rightParsed.ok ? "Valid JSON" : "Invalid JSON"}
            </span>
          </div>
          <textarea
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value)}
            spellCheck={false}
            className="h-48 w-full resize-none rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] leading-6 text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:focus:ring-zinc-700"
            aria-label="Right JSON input"
          />
          <DiffColumn
            title="Right preview"
            parsed={rightParsed}
            statusMap={diff?.right ?? new Map()}
            flags={flags}
          />
        </div>
      </div>
    </div>
  );
}

