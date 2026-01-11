export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export type JsonParseResult =
  | { ok: true; value: Json; formatted: string }
  | { ok: false; errorMessage: string; position?: number };

function extractPositionFromJsonErrorMessage(message: string): number | undefined {
  // V8 / Node often includes: "Unexpected token ... in JSON at position 123"
  const m = message.match(/position\s+(\d+)/i);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

export function parseJson(input: string): JsonParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, errorMessage: "Paste JSON on the left to see formatted output." };
  }

  try {
    const value = JSON.parse(trimmed) as Json;
    const formatted = JSON.stringify(value, null, 2);
    return { ok: true, value, formatted };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return {
      ok: false,
      errorMessage: msg,
      position: extractPositionFromJsonErrorMessage(msg),
    };
  }
}

export function isJsonArray(value: Json): value is Json[] {
  return Array.isArray(value);
}

export function isJsonObject(value: Json): value is { [key: string]: Json } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}


