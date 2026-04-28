import type {Metadata} from "next";
import {ReactQueryProvider} from "@/providers/react-query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Analytics Dashboard",
  description:
      "A production-style SaaS analytics dashboard with mock APIs, filtering, caching, loading states, and dark mode.",
};

// Set the persisted theme before React hydrates to avoid a light/dark flash.
const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("dashboard-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldUseDark);
  } catch {
    document.documentElement.classList.remove("dark");
  }
})();
`;

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body>
      <script dangerouslySetInnerHTML={{__html: themeScript}}/>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
      </html>
  );
}
