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
    <div className="min-h-screen bg-gray-50">
      <AuthProvider>
        <MobileAdminNavigation />
        <main className="lg:pl-0">
          {children}
        </main>
      </AuthProvider>
    </div>
  );
}
