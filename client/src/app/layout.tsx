// client/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Importe o AuthProvider

export const metadata: Metadata = {
  title: "Concessionária Web",
  description: "Seu próximo carro está aqui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider> {/* Envolva o children com o AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}