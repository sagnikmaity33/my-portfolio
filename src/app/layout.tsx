import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NotificationProvider } from "@/components/notification/NotificationProvider";
import { BackToTopButton } from "@/components/BackToTopButton";

const inter = localFont({
  src: "../../public/fonts/InterVariable.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sagnik Maity | Software Engineer",
  description:
    "Backend Engineer specializing in distributed systems, scalable APIs, and data platforms.",
  metadataBase: new URL("https://sagnikmaity.in"),
  openGraph: {
    title: "Sagnik Maity | Software Engineer",
    description:
      "Backend Engineer specializing in distributed systems, scalable APIs, and data platforms.",
    url: "https://sagnikmaity.in",
    siteName: "Sagnik Maity Portfolio",
    images: [
      {
        url: "https://sagnikmaity.in/icon.jpg",
        width: 585,
        height: 588,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagnik Maity | Software Engineer",
    description:
      "Backend Engineer specializing in distributed systems, scalable APIs, and data platforms.",
    images: ["https://sagnikmaity.in/icon.jpg"],
  },
  icons: {
    icon: "/icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${inter.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <NotificationProvider>
          {children}
          <BackToTopButton />
        </NotificationProvider>
      </body>
    </html>
  );
}
