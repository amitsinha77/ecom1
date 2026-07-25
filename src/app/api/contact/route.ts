import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: boolean;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const subject = (body.subject ?? "").trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json(
      { error: "Consent is required under GDPR" },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase.from("contact_enquiries").insert({
      name,
      email,
      phone,
      subject,
      message,
    });

    if (error) throw error;

    return NextResponse.json(
      { ok: true, message: "Enquiry received" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Could not submit enquiry" },
      { status: 500 }
    );
  }
}
