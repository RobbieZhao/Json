"use client";

import React from "react";
import type { Json } from "../utils/json";
import { isJsonArray, isJsonObject } from "../utils/json";

type Path = Array<string | number>;

type JsonScalarValue = Exclude<Json, Json[] | { [k: string]: Json }>;

function pathToId(path: Path): string {
  if (path.length === 0) return "$";
  let out = "$";
  for (const seg of path) {
    if (typeof seg === "number") out += `[${seg}]`;
    else if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(seg)) out += `.${seg}`;
    else out += `[${JSON.stringify(seg)}]`;
  }
  return out;
}

function getContainerPaths(value: Json, basePath: Path = []): string[] {
  const id = pathToId(basePath);
  const out: string[] = [];

  if (isJsonArray(value)) {
    out.push(id);
    value.forEach((v, i) => out.push(...getContainerPaths(v, [...basePath, i])));
    return out;
  }

  if (isJsonObject(value)) {
    out.push(id);
    for (const [k, v] of Object.entries(value)) {
      out.push(...getContainerPaths(v, [...basePath, k]));
    }
    return out;
  }

  return out;
}

function JsonScalar({ value }: { value: JsonScalarValue }) {
  if (value === null) return <span className="text-zinc-500">null</span>;
  if (typeof value === "string") return <span className="text-emerald-700">&quot;{value}&quot;</span>;
  if (typeof value === "number") return <span className="text-blue-700">{String(value)}</span>;
  return <span className="text-purple-700">{String(value)}</span>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
      {children}
    </span>
  );
}

type NodeProps = {
  value: Json;
  path: Path;
  name?: string | number;
  collapsed: Set<string>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
  level: number;
};

function Node({ value, path, name, collapsed, setCollapsed, level }: NodeProps) {
  const id = pathToId(path);
  const isCollapsed = collapsed.has(id);
  const indent = { paddingLeft: `${level * 16}px` };

  const toggle = () => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const keyLabel =
    name === undefined ? null : (
      <span className="text-zinc-800 dark:text-zinc-100">
        {typeof name === "number" ? `[${name}]` : name}
      </span>
    );

  if (isJsonArray(value)) {
    const len = value.length;
    return (
      <div style={indent} className="leading-6">
        <button
          type="button"
          onClick={toggle}
          className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          <span className="text-zinc-500">{isCollapsed ? "▸" : "▾"}</span>
        </button>
        {keyLabel ? <>{keyLabel}: </> : null}
        <span className="text-zinc-600 dark:text-zinc-300">[</span>
        <Badge>Array({len})</Badge>
        {isCollapsed ? (
          <span className="text-zinc-500"> … </span>
        ) : (
          <div className="mt-1">
            {len === 0 ? (
              <div style={{ paddingLeft: "16px" }} className="text-zinc-500">
                (empty)
              </div>
            ) : (
              value.map((v, i) => (
                <Node
                  key={pathToId([...path, i])}
                  value={v}
                  path={[...path, i]}
                  name={i}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  level={level + 1}
                />
              ))
            )}
          </div>
        )}
        <div style={indent} className="text-zinc-600 dark:text-zinc-300">
          ]
        </div>
      </div>
    );
  }

  if (isJsonObject(value)) {
    const keys = Object.keys(value);
    return (
      <div style={indent} className="leading-6">
        <button
          type="button"
          onClick={toggle}
          className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          <span className="text-zinc-500">{isCollapsed ? "▸" : "▾"}</span>
        </button>
        {keyLabel ? <>{keyLabel}: </> : null}
        <span className="text-zinc-600 dark:text-zinc-300">{"{"}</span>
        <Badge>Object({keys.length})</Badge>
        {isCollapsed ? (
          <span className="text-zinc-500"> … </span>
        ) : (
          <div className="mt-1">
            {keys.length === 0 ? (
              <div style={{ paddingLeft: "16px" }} className="text-zinc-500">
                (empty)
              </div>
            ) : (
              keys.map((k) => (
                <Node
                  key={pathToId([...path, k])}
                  value={value[k] as Json}
                  path={[...path, k]}
                  name={k}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  level={level + 1}
                />
              ))
            )}
          </div>
        )}
        <div style={indent} className="text-zinc-600 dark:text-zinc-300">
          {"}"}
        </div>
      </div>
    );
  }

  return (
    <div style={indent} className="leading-6">
      <span className="inline-flex h-6 w-6" />
      {keyLabel ? <>{keyLabel}: </> : null}
      <JsonScalar value={value as JsonScalarValue} />
    </div>
  );
}

export function JsonTree({
  value,
  className,
}: {
  value: Json;
  className?: string;
}) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() => new Set());

  // Reset collapse state when the root value changes (keeps things predictable when pasting new JSON).
  React.useEffect(() => {
    setCollapsed(new Set());
  }, [value]);

  const containerPaths = React.useMemo(() => getContainerPaths(value), [value]);

  const expandAll = () => setCollapsed(new Set());
  const collapseAll = () => {
    // Collapse all containers except root, so you still see the top-level shape.
    const ids = containerPaths.filter((p) => p !== "$");
    setCollapsed(new Set(ids));
  };

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Collapse all
        </button>
        <div className="text-xs text-zinc-500">
          Tip: click the caret next to a field to collapse/expand.
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] dark:border-zinc-800 dark:bg-zinc-950">
        <Node
          value={value}
          path={[]}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          level={0}
        />
      </div>
    </div>
  );
}


