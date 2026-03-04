import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boat Pricing Calculator | DataSalt",
  description:
    "AI-powered boat pricing calculator for the Gulf Coast market. Get instant valuations with XGBoost predictions, comparable sales, and market insights.",
  openGraph: {
    title: "Boat Pricing Calculator — boats.datasalt.ai",
    description:
      "Predict boat sale prices with machine learning. Powered by XGBoost trained on 2,000+ Gulf Coast transactions.",
  },
};

export default function BoatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inherits root layout (Navbar, Footer, ThemeProvider) automatically
  return <>{children}</>;
}
