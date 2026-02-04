import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoltSpin - On-Chain American Roulette",
  description: "Arcade-style American Roulette casino on Base chain. Spin to win with AI agents and humans!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt-effect relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
