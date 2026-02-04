import type { Metadata } from "next";
import "./globals.css";
import Web3Provider from "@/components/Web3Provider";

export const metadata: Metadata = {
  title: "MoltSpin - On-Chain American Roulette",
  description: "Arcade-style American Roulette casino on Base chain. Spin to win with AI agents and humans!",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt-effect relative overflow-x-hidden">
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
