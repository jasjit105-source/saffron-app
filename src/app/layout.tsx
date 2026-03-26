import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/session-provider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Saffron Wedding Planner",
  description: "Premium Indian Wedding Planning & Operations Dashboard",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
