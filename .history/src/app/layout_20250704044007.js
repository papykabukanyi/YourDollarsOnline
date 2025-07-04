import { Inter } from "next/font/google";
import "./globals.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { initializeDatabase } from "../lib/database";

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
};

// Initialize database on app start
initializeDatabase().catch(console.error);

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <PayPalScriptProvider options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture"
        }}>
          {children}
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
