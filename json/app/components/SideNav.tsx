"use client";

import React from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  hint?: string;
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Formatter", hint: "JSON tools", href: "/" },
  { label: "JSON Diff", hint: "Compare payloads", href: "/json-diff" },
  { label: "JSON ⇄ YAML", hint: "Convert formats", href: "/json-yaml" },
  { label: "Coming soon", hint: "Future tools" },
];

export function SideNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav
      className={[
        "relative isolate flex h-full flex-col items-stretch rounded-xl",
        "border border-zinc-200 bg-white px-2 py-3 shadow-sm backdrop-blur-sm",
        "transition-[width] duration-200",
        "dark:border-zinc-800 dark:bg-zinc-950/80",
        isOpen ? "w-52" : "w-14",
      ].join(" ")}
      aria-label="Side navigation"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse tools panel" : "Expand tools panel"}
        className="group flex h-9 w-full items-center justify-center rounded-lg border border-transparent text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        <span
          className={[
            "flex h-7 w-7 items-center justify-center rounded-full border",
            "border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700",
            "transition group-hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
          ].join(" ")}
        >
          {isOpen ? "←" : "→"}
        </span>
      </button>

      <div className="mt-3 flex-1 space-y-1 overflow-hidden">
        {NAV_ITEMS.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                title={item.label}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-zinc-700 transition",
                  "hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900",
                  isOpen ? "justify-start" : "justify-center",
                ].join(" ")}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  {item.label.slice(0, 2)}
                </span>
                {isOpen ? (
                  <span className="flex flex-col">
                    <span className="font-semibold leading-tight">{item.label}</span>
                    {item.hint ? (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.hint}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </Link>
            ) : (
              <div
                title={item.label}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-zinc-500 transition",
                  "cursor-default opacity-70 dark:text-zinc-400",
                  isOpen ? "justify-start" : "justify-center",
                ].join(" ")}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
                  {item.label.slice(0, 2)}
                </span>
                {isOpen ? (
                  <span className="flex flex-col">
                    <span className="font-semibold leading-tight">{item.label}</span>
                    {item.hint ? (
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.hint}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>

      {isOpen ? (
        <div className="mt-2 rounded-lg border border-dashed border-zinc-200 p-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          More tools are on the way.
        </div>
      ) : null}
    </nav>
  );
}
