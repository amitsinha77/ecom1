import { NextResponse } from "next/server";

type ReminderPayload = {
  email?: string;
  name?: string;
  date?: string;
  time?: string;
  service?: string;
};

export async function POST(request: Request) {
  let body: ReminderPayload;
  try {
    body = (await request.json()) as ReminderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Resend integration: if RESEND_API_KEY is configured, send a real email.
  // Otherwise, log the reminder and return success (graceful degradation).
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "PureMaids <hello@puremaids.co.uk>",
          to: body.email,
          subject: "Your PureMaids cleaning reminder",
          html: `
            <h2>Hi ${body.name ?? "there"},</h2>
            <p>This is a friendly reminder about your upcoming PureMaids cleaning appointment.</p>
            <p><strong>Date:</strong> ${body.date ?? "TBD"}<br/>
            <strong>Time:</strong> ${body.time ?? "TBD"}<br/>
            <strong>Service:</strong> ${body.service ?? "Cleaning"}</p>
            <p>We look forward to making your home sparkle!</p>
            <p>Best regards,<br/>The PureMaids Team</p>
          `,
        }),
      });
      if (!res.ok) throw new Error("Resend API error");
    } catch (err) {
      console.error("Email send error:", err);
      return NextResponse.json({ error: "Could not send email" }, { status: 500 });
    }
  } else {
    console.log(`[Email reminder] To: ${body.email}, Name: ${body.name}, Date: ${body.date}, Time: ${body.time}`);
  }

  return NextResponse.json({ ok: true, message: "Reminder queued" });
}
