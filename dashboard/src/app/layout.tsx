import { FeedbackProvider } from "@/components/bot/feedback";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/theme-context";
import { cn } from "@/utils";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "xorizn-bot — Dashboard",
  description: "Dashboard pengaturan bot WhatsApp",
  icons: { icon: "/images/logo/logo-icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" dir="ltr" suppressHydrationWarning>
      <body className={cn("relative isolate dark:bg-gray-900", outfit.className)}>
        <ThemeProvider>
          <TooltipProvider>
            <FeedbackProvider>{children}</FeedbackProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
