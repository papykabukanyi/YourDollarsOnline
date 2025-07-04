'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    // Initialize database on client side
    const initDB = async () => {
      try {
        await fetch('/api/init');
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };
    
    initDB();
  }, []);

  return (
    <PayPalScriptProvider options={{
      "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "demo",
      currency: "USD",
      intent: "capture"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}
