import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Occupancy Forecasting Dashboard | DataSalt",
  description:
    "AI-powered occupancy forecasting and revenue management for SPI Beach Resort. Prophet-based demand prediction, dynamic pricing simulation, and guest sentiment analysis.",
  openGraph: {
    title: "SPI Beach Resort Occupancy Dashboard — resort.datasalt.ai",
    description:
      "Predict occupancy rates with Prophet forecasting. Powered by 3 years of booking, pricing, and sentiment data.",
  },
};

export default function ResortLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inherits root layout (Navbar, Footer, ThemeProvider) automatically
  return <>{children}</>;
}
