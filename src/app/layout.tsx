import "./globals.css";
import { getUrl } from "@/utilities/getUrl";
import { Geist_Mono, Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import DotGridBackground from "@/components/backgrounds/DotGridBackground";

type Props = {
  children: React.ReactNode;
};

const GeistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-geist-sans bg-white overscroll-none dark:bg-zinc-900 dot-grid-bg-container">
        <ThemeProvider defaultTheme="system" storageKey="ahmet-theme">
          <DotGridBackground />
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-M80GLPRQFQ" />
      <Analytics />
    </html>
  );
};

export default RootLayout;

export const viewport: Viewport = {
  themeColor: "#ffffff",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getUrl),
  title: {
    default: "Aditya Kumar Tiwari",
    template: `%s - Aditya Kumar Tiwari`,
  },
  description: "Cybersecurity Specialist & Full-Stack Developer. Explore my projects, experience, and get in touch for collaboration.",
  icons: {
    icon: '/icon.svg', // or '/icon.png' if using the dynamic approach
  },
  openGraph: {
    images: [],
  },
};


