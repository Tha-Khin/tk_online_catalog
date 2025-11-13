import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/ToastProvider";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "TK Online Catalog",
  description: "Showcase Your Products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`antialiased`}>
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
