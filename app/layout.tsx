import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "MA LEGEND — Digital Developer & Creator", description: "The portfolio of MA LEGEND (LEGEND MOD), developer and digital creator." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
