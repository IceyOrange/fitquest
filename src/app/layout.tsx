import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";

import type { Metadata, Viewport } from "next";
import ProductBrief from "@/components/ProductBrief";

export const metadata: Metadata = {
  title: "搭搭动 Dabble — 和搭子一起动",
  description: "在你最想偷懒的那一刻，看见熟人正在动。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#faf6ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/cn-fontsource-smiley-sans-oblique-regular@1.0.1/font.css"
        />
      </head>
      <body>
        <ProductBrief />
        {children}
      </body>
    </html>
  );
}
