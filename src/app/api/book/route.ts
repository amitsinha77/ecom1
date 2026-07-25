import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

type BookingPayload = {
  service?: string;
  bedrooms?: string;
  bathrooms?: string;
  frequency?: string;
  estimate?: number;
  date?: string;
  time?: string;
  address?: string;
  postcode?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  consent?: boolean;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPostcode(postcode: string): boolean {
  return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode);
}

export async function POST(request: Request) {
  let body: BookingPayload;
  try {
    body = (await request.json()) as BookingPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const required = ["service", "date", "time", "address", "postcode", "name", "email", "phone"];
  for (const field of required) {
    const value = body[field as keyof BookingPayload];
    if (!value || String(value).trim() === "") {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  if (!isValidEmail(body.email!)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!isValidPostcode(body.postcode!)) {
    return NextResponse.json({ error: "Valid UK postcode is required" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ error: "Consent is required under GDPR" }, { status: 400 });
  }

  try {
    const { error } = await supabase.from("booking_enquiries").insert({
      service: body.service,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      frequency: body.frequency,
      estimate: body.estimate ?? 0,
      preferred_date: body.date,
      preferred_time: body.time,
      address: body.address,
      postcode: body.postcode,
      name: body.name,
      email: body.email,
      phone: body.phone,
      notes: body.notes,
      status: "pending",
    });

    if (error) throw error;

    return NextResponse.json(
      { ok: true, message: "Booking enquiry received" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Could not submit booking" }, { status: 500 });
  }
}
