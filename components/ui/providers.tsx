// components/providers.tsx
'use client'; // MARCA ESTE ARQUIVO COMO CLIENT COMPONENT

import type React from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react"; // Use a versão /react aqui

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children} 
      <Toaster position="top-right" richColors />
      <Analytics /> 
    </>
  );
}