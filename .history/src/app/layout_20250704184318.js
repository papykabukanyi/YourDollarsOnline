import { Inter } from "next/font/google";
import "./globals.css";
import MobileNavigation from "../components/MobileNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "YourDollarsOnline - Premium E-commerce Store",
  description: "Shop premium products at YourDollarsOnline. Fast delivery, secure payments, and exceptional customer service.",
  keywords: "ecommerce, online shopping, premium products, fast delivery",
  authors: [{ name: "YourDollarsOnline" }],
  creator: "YourDollarsOnline",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "YourDollarsOnline - Premium E-commerce Store",
    description: "Shop premium products at YourDollarsOnline. Fast delivery, secure payments, and exceptional customer service.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: "YourDollarsOnline",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourDollarsOnline - Premium E-commerce Store",
    description: "Shop premium products at YourDollarsOnline. Fast delivery, secure payments, and exceptional customer service.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YourDollarsOnline'
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YourDollarsOnline" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <MobileNavigation />
        <main className="lg:pl-0">
          {children}
        </main>
      </body>
    </html>
  );
}
