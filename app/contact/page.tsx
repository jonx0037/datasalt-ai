import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Start a Project — DataSalt",
  description:
    "Tell us about your AI/ML project. Every DataSalt engagement starts with a no-pressure discovery conversation.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <ContactSection />
    </div>
  );
}
