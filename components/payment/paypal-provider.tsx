"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "AZ-Q_K85b1l0mT2kl0rSDSkFvpoyzvHcV_Y4Xs-Vtwvkhsl8",
      currency: "USD",
      intent: "capture"
    }}>
      {children}
    </PayPalScriptProvider>
  );
}
