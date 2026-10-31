import type { Metadata } from "next";
import { Quicksand, Geist_Mono } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlashAfterlife 🪦 | The Flash Game Preservation Altar",
  description:
    "Resurrecting departed 2000s Adobe Flash games on pure HTML5 Canvas right inside your browser. Decompile vintage .swf binaries and play retro web classics with zero plugins.",
  keywords: [
    "Flash preservation",
    "Adobe Flash",
    "Día de los Muertos",
    "Ghost in the Machine",
    "SWF decompressor",
    "ActionScript to Canvas",
    "Retro Gaming",
    "Web Preservation",
  ],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
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
      className={`${quicksand.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#140827] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
