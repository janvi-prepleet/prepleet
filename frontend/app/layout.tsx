import type { Metadata } from "next";
import { Header } from "@/components/header";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "PrepLeet | Crack guesstimates before you crack cases",
    template: "%s | PrepLeet",
  },
  description:
    "Learn guesstimates with clear frameworks, worked examples and practical guides for consulting and product interviews.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="pl">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
