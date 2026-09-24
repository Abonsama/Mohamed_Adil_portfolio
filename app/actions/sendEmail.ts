"use server";

import { Resend } from "resend";

export async function sendEmailAction(formData: FormData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("Missing RESEND_API_KEY environment variable.");
    return {
      success: false,
      error: "Server configuration error: Missing RESEND_API_KEY in .env.local",
    };
  }

  const resend = new Resend(apiKey);

  const senderEmail = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!senderEmail || !message) {
    return { success: false, error: "Please fill out all fields." };
  }

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aboon20018@gmail.com",
      replyTo: senderEmail,
      subject: `New Portfolio Message from ${senderEmail}`,
      html: `<p><strong>Sender:</strong> ${senderEmail}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email." };
  }
}