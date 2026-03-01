import { Resend } from "resend";
import { z } from "zod";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  projectType: z.enum(["discovery", "consulting", "fullstack", "unsure"] as const),
  description: z.string().min(10),
  timeline: z.enum(["asap", "1-3mo", "3-6mo", "exploring"] as const),
});

const projectTypeLabels: Record<string, string> = {
  discovery: "Discovery Audit",
  consulting: "Core AI/ML Consulting",
  fullstack: "Full-Stack Add-On",
  unsure: "Not Sure",
};

const timelineLabels: Record<string, string> = {
  asap: "ASAP",
  "1-3mo": "1–3 months",
  "3-6mo": "3–6 months",
  exploring: "Just exploring",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const { error } = await resend.emails.send({
      from: "DataSalt Contact <hello@datasalt.ai>",
      to: ["jon@datasalt.ai"],
      replyTo: data.email,
      subject: `New inquiry: ${projectTypeLabels[data.projectType]} — ${data.name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1B2A4A;">
          <div style="border-bottom: 2px solid #0D9488; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="font-size: 20px; font-weight: 700; margin: 0; color: #0D9488;">DataSalt — New Inquiry</h1>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; width: 120px; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Name</td>
              <td style="padding: 8px 0; font-size: 15px;">${data.name}</td>
            </tr>
            ${data.company ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Company</td>
              <td style="padding: 8px 0; font-size: 15px;">${data.company}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${data.email}" style="color: #0D9488;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Service</td>
              <td style="padding: 8px 0; font-size: 15px;">${projectTypeLabels[data.projectType]}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Timeline</td>
              <td style="padding: 8px 0; font-size: 15px;">${timelineLabels[data.timeline]}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #F3F4F6; border-radius: 8px;">
            <p style="font-weight: 600; color: #6B7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;">Project Description</p>
            <p style="font-size: 15px; line-height: 1.6; margin: 0; color: #1B2A4A;">${data.description}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #9CA3AF;">Sent via datasalt.ai contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: err.issues }, { status: 400 });
    }
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
