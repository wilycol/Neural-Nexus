"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.warn("[PayPal] Warning: NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing.");
  }

  return (
    <PayPalScriptProvider options={{ 
      clientId: clientId || "",
      currency: "USD",
      intent: "capture"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}
