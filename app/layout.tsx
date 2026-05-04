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
  metadataBase: new URL("https://gspublicationsandmissions.org"),

  title: {
    default: "Gospel Sounders Publications & Missions",
    template: "%s | Gospel Sounders Publications & Missions",
  },

  description:
    "Gospel Sounders Publications & Missions is dedicated to revealing the Father and the Son through sound doctrine, Bible studies, publications, and missionary work, proclaiming the Three Angels’ Messages to all nations.",

  applicationName: "Gospel Sounders",

  keywords: [
    "Gospel Sounders",
    "Three Angels Message",
    "Historic Adventism",
    "Bible Studies",
    "Sanctuary Message",
    "Sabbath Truth",
    "Spirit of Prophecy",
    "Christian Publications",
    "Missionary Work",
    "Zadock Opiyo Ponde",
    "Wyclife Omondi",
    "One true God"

  ],

  authors: [{ name: "Gospel Sounders Publications & Missions" }],
  creator: "Gospel Sounders Publications & Missions",
  publisher: "Gospel Sounders Publications & Missions",

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
    url: "https://gspublicationsandmissions.org",
    title: "Gospel Sounders Publications & Missions",
    description:
      "Revealing the Father and the Son, proclaiming the everlasting gospel through the three angels’ messages, restoring biblical truth, and practically preparing a people for Christ’s soon return.",
    siteName: "Gospel Sounders Publications & Missions",
    images: [
      {
        url: "/images/logo.jpeg", // PLACE THIS IN /public
        width: 1200,
        height: 630,
        alt: "Gospel Sounders Publications & Missions Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gospel Sounders Publications & Missions",
    description:
      "Revealing the Father and the Son, proclaiming the everlasting gospel through the three angels’ messages, restoring biblical truth, and practically preparing a people for Christ’s soon return.",
    images: ["/images/logo.jpeg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://gspublicationsandmissions.org",
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
