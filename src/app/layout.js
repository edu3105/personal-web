import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "Eugenius Edward Setiadi, software developer. See my work experience and past projects, download my CV, or get in touch.";

export const metadata = {
  metadataBase: new URL("https://edu-personal-web.vercel.app"),
  title: "Eugenius Edward Setiadi",
  description: siteDescription,
  // Used by LinkedIn, WhatsApp, X, etc. when someone shares your link
  openGraph: {
    title: "Eugenius Edward Setiadi",
    description: siteDescription,
    url: "/",
    siteName: "Eugenius Edward Setiadi",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico", // Default favicon
    apple: "/favicon.png", // Apple Touch Icon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Rampart+One&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
        </style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
