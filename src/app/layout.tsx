import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlashAfterlife 🪦 | The Flash Game Preservation Altar",
  description:
    "Resurrecting departed 2000s Adobe Flash games on HTML5 Canvas using Google Gemma open-weight AI and Mastra agent workflows for Hacktoberfest 2026: Ghost in the Machine.",
  keywords: [
    "Flash preservation",
    "Adobe Flash",
    "Hacktoberfest 2026",
    "Ghost in the Machine",
    "Día de los Muertos",
    "Gemma",
    "Mastra",
    "Render",
    "SWF decompressor",
    "ActionScript to Canvas",
    "Open Source AI",
  ],
  authors: [{ name: "FlashAfterlife Preservation Society" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050d14] text-slate-100">
        {children}
      </body>
    </html>
  );
}
