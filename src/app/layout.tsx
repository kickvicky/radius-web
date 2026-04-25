import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { UserProvider } from "@/providers/UserProvider";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Radius - The Pulse",
  description: "Anonymous location-based social platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Kick off the user fetch at the root so it races in parallel with the rest
  // of the render. We intentionally DO NOT await here — passing the promise
  // to <UserProvider> lets Client Components read it via `use()` inside a
  // Suspense boundary, while Server Components that import `getCurrentUser`
  // directly share the same memoized result (via React.cache).
  const userPromise = getCurrentUser();

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <UserProvider userPromise={userPromise}>
          <QueryProvider>{children}</QueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
