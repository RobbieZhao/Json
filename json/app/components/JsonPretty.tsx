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

function JsonScalar({ value }: { value: JsonScalarValue }) {
  if (value === null) return <span className="text-zinc-500">null</span>;
  if (typeof value === "string") {
    return <span className="text-emerald-700 dark:text-emerald-400">{JSON.stringify(value)}</span>;
  }
  if (typeof value === "number") {
    return <span className="text-blue-700 dark:text-blue-400">{String(value)}</span>;
  }
  return <span className="text-purple-700 dark:text-purple-400">{String(value)}</span>;
}

function Caret({ collapsed }: { collapsed: boolean }) {
  return collapsed ? (
    <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true">
      <path d="M7 5l6 5-6 5V5z" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true">
      <path d="M5 7l5 6 5-6H5z" fill="currentColor" />
    </svg>
  );
}

type NodeProps = {
  value: Json;
  path: Path;
  name?: string | number;
  isLast: boolean;
  collapsed: Set<string>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
  level: number;
  indentSize: 2 | 4;
};

function Node({
  value,
  path,
  name,
  isLast,
  collapsed,
  setCollapsed,
  level,
  indentSize,
}: NodeProps) {
  const id = pathToId(path);
  const isCollapsed = collapsed.has(id);
  const indent = { paddingLeft: `${level * indentSize}ch` };

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
      <span className="text-zinc-900 dark:text-zinc-100">
        {JSON.stringify(String(name))}
      </span>
    );

  const comma = isLast ? null : <span className="text-zinc-500">,</span>;

  if (isJsonArray(value)) {
    const len = value.length;
    return (
      <>
        <div style={indent} className="flex items-start leading-6">
          <button
            type="button"
            onClick={toggle}
            className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
            aria-expanded={!isCollapsed}
          >
            <Caret collapsed={isCollapsed} />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="min-w-0 text-left"
            aria-label={isCollapsed ? "Expand array" : "Collapse array"}
            aria-expanded={!isCollapsed}
          >
            {keyLabel ? (
              <>
                {keyLabel}
                <span className="text-zinc-500">: </span>
              </>
            ) : null}
            <span className="text-zinc-500">[</span>
            {isCollapsed || len === 0 ? (
              <>
                {len === 0 ? null : <span className="text-zinc-500">…</span>}
                <span className="text-zinc-500">]</span>
                {comma}
              </>
            ) : null}
          </button>
        </div>
        {isCollapsed || len === 0 ? null : (
          <>
            {value.map((v, i) => (
              <Node
                key={pathToId([...path, i])}
                value={v}
                path={[...path, i]}
                isLast={i === len - 1}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                level={level + 1}
                indentSize={indentSize}
              />
            ))}
            <div style={indent} className="flex items-start leading-6">
              <span className="mr-1 inline-flex h-5 w-5" />
              <span className="text-zinc-500">]</span>
              {comma}
            </div>
          </>
        )}
      </>
    );
  }

  if (isJsonObject(value)) {
    const entries = Object.entries(value);
    return (
      <>
        <div style={indent} className="flex items-start leading-6">
          <button
            type="button"
            onClick={toggle}
            className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
            aria-expanded={!isCollapsed}
          >
            <Caret collapsed={isCollapsed} />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="min-w-0 text-left"
            aria-label={isCollapsed ? "Expand object" : "Collapse object"}
            aria-expanded={!isCollapsed}
          >
            {keyLabel ? (
              <>
                {keyLabel}
                <span className="text-zinc-500">: </span>
              </>
            ) : null}
            <span className="text-zinc-500">{"{"}</span>
            {isCollapsed || entries.length === 0 ? (
              <>
                {entries.length === 0 ? null : <span className="text-zinc-500">…</span>}
                <span className="text-zinc-500">{"}"}</span>
                {comma}
              </>
            ) : null}
          </button>
        </div>
        {isCollapsed || entries.length === 0 ? null : (
          <>
            {entries.map(([k, v], idx) => (
              <Node
                key={pathToId([...path, k])}
                value={v}
                path={[...path, k]}
                name={k}
                isLast={idx === entries.length - 1}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                level={level + 1}
                indentSize={indentSize}
              />
            ))}
            <div style={indent} className="flex items-start leading-6">
              <span className="mr-1 inline-flex h-5 w-5" />
              <span className="text-zinc-500">{"}"}</span>
              {comma}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div style={indent} className="flex items-start leading-6">
      <span className="mr-1 inline-flex h-5 w-5" />
      <div className="min-w-0">
        {keyLabel ? (
          <>
            {keyLabel}
            <span className="text-zinc-500">: </span>
          </>
        ) : null}
        <JsonScalar value={value as JsonScalarValue} />
        {comma}
      </div>
    </div>
  );
}

export function JsonPretty({ value, indentSize }: { value: Json; indentSize: 2 | 4 }) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(() => new Set());

  React.useEffect(() => {
    setCollapsed(new Set());
  }, [value]);

  return (
    <div className="h-[70vh] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] leading-6 dark:border-zinc-800 dark:bg-black">
      <Node
        value={value}
        path={[]}
        isLast={true}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        level={0}
        indentSize={indentSize}
      />
    </div>
  );
}


