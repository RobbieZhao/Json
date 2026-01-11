"use client";

import React from "react";

type Token =
  | { kind: "whitespace"; text: string }
  | { kind: "punct"; text: string }
  | { kind: "string"; text: string; isKey: boolean }
  | { kind: "number"; text: string }
  | { kind: "boolean"; text: string }
  | { kind: "null"; text: string }
  | { kind: "unknown"; text: string };

function isWhitespace(ch: string) {
  return ch === " " || ch === "\n" || ch === "\t" || ch === "\r";
}

function tokenizeJson(json: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const peekNonWs = (start: number) => {
    let j = start;
    while (j < json.length && isWhitespace(json[j]!)) j++;
    return json[j];
  };

  while (i < json.length) {
    const ch = json[i]!;

    // whitespace
    if (isWhitespace(ch)) {
      let j = i + 1;
      while (j < json.length && isWhitespace(json[j]!)) j++;
      tokens.push({ kind: "whitespace", text: json.slice(i, j) });
      i = j;
      continue;
    }

    // punctuation
    if (ch === "{" || ch === "}" || ch === "[" || ch === "]" || ch === ":" || ch === ",") {
      tokens.push({ kind: "punct", text: ch });
      i += 1;
      continue;
    }

    // string
    if (ch === '"') {
      let j = i + 1;
      let escaped = false;
      while (j < json.length) {
        const c = json[j]!;
        if (escaped) {
          escaped = false;
          j += 1;
          continue;
        }
        if (c === "\\") {
          escaped = true;
          j += 1;
          continue;
        }
        if (c === '"') {
          j += 1; // include closing quote
          break;
        }
        j += 1;
      }

      const text = json.slice(i, j);
      const nextNonWs = peekNonWs(j);
      tokens.push({ kind: "string", text, isKey: nextNonWs === ":" });
      i = j;
      continue;
    }

    // number
    // JSON numbers: -? (0|[1-9]\d*) (\.\d+)? ([eE][+-]?\d+)?
    if (ch === "-" || (ch >= "0" && ch <= "9")) {
      let j = i + 1;
      while (j < json.length) {
        const c = json[j]!;
        const isNumChar =
          (c >= "0" && c <= "9") || c === "." || c === "e" || c === "E" || c === "+" || c === "-";
        if (!isNumChar) break;
        j += 1;
      }
      tokens.push({ kind: "number", text: json.slice(i, j) });
      i = j;
      continue;
    }

    // literals
    if (json.startsWith("true", i) || json.startsWith("false", i)) {
      const lit = json.startsWith("true", i) ? "true" : "false";
      tokens.push({ kind: "boolean", text: lit });
      i += lit.length;
      continue;
    }

    if (json.startsWith("null", i)) {
      tokens.push({ kind: "null", text: "null" });
      i += 4;
      continue;
    }

    // fallback
    tokens.push({ kind: "unknown", text: ch });
    i += 1;
  }

  return tokens;
}

function TokenSpan({ token }: { token: Token }) {
  switch (token.kind) {
    case "whitespace":
      return <>{token.text}</>;
    case "punct":
      return <span className="text-zinc-500">{token.text}</span>;
    case "string":
      return token.isKey ? (
        <span className="text-zinc-900 dark:text-zinc-100">{token.text}</span>
      ) : (
        <span className="text-emerald-700 dark:text-emerald-400">{token.text}</span>
      );
    case "number":
      return <span className="text-blue-700 dark:text-blue-400">{token.text}</span>;
    case "boolean":
      return <span className="text-purple-700 dark:text-purple-400">{token.text}</span>;
    case "null":
      return <span className="text-zinc-500">{token.text}</span>;
    default:
      return <span className="text-red-600">{token.text}</span>;
  }
}

export function JsonPretty({ value }: { value: string }) {
  const tokens = React.useMemo(() => tokenizeJson(value), [value]);

  return (
    <pre className="h-[70vh] overflow-auto rounded-lg border border-zinc-200 bg-white p-3 font-mono text-[13px] leading-6 dark:border-zinc-800 dark:bg-black">
      <code>
        {tokens.map((t, idx) => (
          <TokenSpan key={idx} token={t} />
        ))}
      </code>
    </pre>
  );
}


