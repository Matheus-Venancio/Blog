import React from "react";
import Header from "@/components/Header/Header";
import { Inter, PT_Serif } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import Providers from "@/helpers/providers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "MBL Campinas",
  description: "Website oficial do MBL Campinas",
  generator: "Next.js",
  applicationName: "mblcampinas",
  referrer: "origin-when-cross-origin",
  keywords: ["Next.js", "React", "JavaScript", "MBL", "Campinas"],
  // authors: [{ name: 'Miguel Demarque' }],
  // colorScheme: 'dark',
  creator: "Miguel Demarque",
  // Used to remove hyperlink in iOS devices
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body
        className={`${ptSerif.variable} ${inter.className} min-h-screen relative pb-80 sm:pb-52`}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
