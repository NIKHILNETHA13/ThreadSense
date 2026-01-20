import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "Redeco - Review Decoder",
  description: "AI-Powered Reddit Review Intelligence - Decode authentic product insights from real discussions",
};

import { Providers } from "./Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jakarta.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
