import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "../../contexts/AuthContext";
import MobileAdminNavigation from "../../components/MobileAdminNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard - YourDollarsOnline",
  description: "Administrative dashboard for YourDollarsOnline e-commerce platform",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="YourDollarsOnline Admin" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <MobileAdminNavigation />
          <main className="lg:pl-0">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
