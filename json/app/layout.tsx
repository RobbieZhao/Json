import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://awesomejson.vercel.app"),
  title: {
    default: "JSON Formatter with Array Lengths & Tree View",
    template: "%s | AwesomeJSON",
  },
  description:
    "Free online JSON formatter and parser. Instantly visualize JSON structure, expand/collapse nodes, and see array lengths.",
  alternates: {
    canonical: "https://awesomejson.vercel.app/",
  },
  openGraph: {
    title: "JSON Formatter with Array Lengths & Tree View",
    description:
      "Free online JSON formatter and parser. Instantly visualize JSON structure, expand/collapse nodes, and see array lengths.",
    url: "https://awesomejson.vercel.app/",
    siteName: "AwesomeJSON",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "AwesomeJSON",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Formatter with Array Lengths & Tree View",
    description:
      "Free online JSON formatter and parser. Instantly visualize JSON structure, expand/collapse nodes, and see array lengths.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
