import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bible Reader App",
  description: "Learn Mandarin via Scripture",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* FIX: suppressHydrationWarning mengatasi error extension browser */}
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <ToastProvider>
            <main className="min-h-screen bg-gray-50 text-gray-900">
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}