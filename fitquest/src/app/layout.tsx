"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SessionProvider>
          <div className="max-w-md mx-auto min-h-screen bg-white relative">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
