import { ReduxProvider } from "@/redux/provider";
import { Inter } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@/components/ui/sonner";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
