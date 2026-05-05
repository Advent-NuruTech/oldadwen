import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oldsda.org"),

  title: {
    default: "Old SDA Organization",
    template: "%s | Old SDA Organization",
  },

  description:
    "Old SDA Organization is a Bible-based reform movement rooted in historic Adventism, proclaiming the One True God (the Father), the literal Son of God, and rejecting the Trinity. We uphold pioneer Adventist teachings, the Three Angels’ Messages, health reform, and missionary work as part and parcel of true Bible faith.",

  applicationName: "Old SDA Organization",

  keywords: [
    "Old SDA Organization",
    "Old Adventism",
    "Historic Adventism",
    "Pioneer Adventist Faith",
    "One True God",
    "Non-Trinitarian",
    "Anti-Trinitarian",
    "Trinity rejection",
    "Bible truth movement",
    "Three Angels Message",
    "Sabbath truth",
    "Spirit of Prophecy",
    "Adventist reform movement",
    "Health reform",
    "Bible studies",
    "Missionary work",
  ],

  authors: [{ name: "Old SDA Organization" }],
  creator: "Old SDA Organization",
  publisher: "Old SDA Organization",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    url: "https://oldsda.org",
    title: "Old SDA Organization",
    description:
      "A Bible-based reform movement restoring pioneer Adventist faith, proclaiming the One True God, rejecting the Trinity, and advancing the Three Angels’ Messages worldwide.",
    siteName: "Old SDA Organization",
    images: [
      {
        url: "/images/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Old SDA Organization Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Old SDA Organization",
    description:
      "Restoring pioneer Adventist faith: One True God, non-Trinitarian belief, and the Three Angels’ Messages.",
    images: ["/images/logo.jpeg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://oldsda.org",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
