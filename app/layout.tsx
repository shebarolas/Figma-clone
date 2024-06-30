import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Figma Clone",
  description: "Creación de clone de figma con Fabric.js y Liveblocks para trabajo colaborativo en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-500">
      <body className={inter.className}>
        <Room>
          {children}
        </Room>
      </body>
    </html>
  );
}
