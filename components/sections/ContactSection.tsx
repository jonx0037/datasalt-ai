"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  projectType: z.enum(["discovery", "consulting", "fullstack", "unsure"] as const, {
    error: "Please select a project type",
  }),
  description: z.string().min(10, "Please describe your project in at least 10 characters"),
  timeline: z.enum(["asap", "1-3mo", "3-6mo", "exploring"] as const, {
    error: "Please select a timeline",
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: text */}
          <div>
            <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
              Get in Touch
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Start the
              <br />
              Conversation.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Tell us about your project and we&apos;ll follow up within one
              business day. No sales pressure — just a straightforward
              conversation about what you&apos;re trying to build.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" aria-hidden />
                Free initial consultation
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" aria-hidden />
                Response within 1 business day
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" aria-hidden />
                Project scoped before any commitment
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-teal" />
                <h3 className="text-xl font-semibold text-foreground">
                  Message Received
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Thanks for reaching out. We&apos;ll be in touch within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Organization (optional)"
                      {...register("company")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Project Type *</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue("projectType", val as ContactFormData["projectType"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className={errors.projectType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery Audit</SelectItem>
                      <SelectItem value="consulting">Core AI/ML Consulting</SelectItem>
                      <SelectItem value="fullstack">Full-Stack Add-On</SelectItem>
                      <SelectItem value="unsure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.projectType && (
                    <p className="text-xs text-destructive">{errors.projectType.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Tell us about your project *</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe the problem you're trying to solve or the outcome you need..."
                    rows={4}
                    {...register("description")}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Timeline *</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue("timeline", val as ContactFormData["timeline"], {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className={errors.timeline ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-3mo">1–3 months</SelectItem>
                      <SelectItem value="3-6mo">3–6 months</SelectItem>
                      <SelectItem value="exploring">Just exploring</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.timeline && (
                    <p className="text-xs text-destructive">{errors.timeline.message}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-teal hover:bg-teal/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Start the Conversation"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
