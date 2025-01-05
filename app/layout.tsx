import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import { ThemeProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lukhanyo Radebe",
  description: "Creative Software Developer passionate about building elegant, scalable, and user-focused web applications using Next.js. Explore seamless UI design, robust APIs, and modern digital solutions. Let me turn your ideas into reality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="theme" // Optional: specify custom storage key
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}