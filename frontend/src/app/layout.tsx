import type { Metadata } from "next";
import { Montserrat, Patrick_Hand } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner/sonner";

/**
 * RootLayout is the main layout component for the application.
 */

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600"],
});

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  variable: "--font-patrick-hand",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Bullet Journal App",
  description: "Track your habits and save your daily journals",
};

<meta name="apple-mobile-web-app-title" content="HabitTracker" />

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${patrickHand.variable} font-sans`}>
        <Providers>{children}</Providers>
        <Toaster position="top-center" closeButton /> 
      </body>
    </html>
  );
}
