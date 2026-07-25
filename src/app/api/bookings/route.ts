import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

type BookingPayload = {
  service?: string;
  bedrooms?: number;
  bathrooms?: number;
  frequency?: string;
  postcode?: string;
  address?: string;
  bookingDate?: string;
  bookingTime?: string;
  extras?: string[];
  basePrice?: number;
  extrasPrice?: number;
  totalPrice?: number;
  depositAmount?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
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

  const required = ["service", "postcode", "address", "bookingDate", "bookingTime", "customerName", "customerEmail", "customerPhone"];
  for (const field of required) {
    const value = body[field as keyof BookingPayload];
    if (!value || String(value).trim() === "") {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  if (!isValidEmail(body.customerEmail!)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!isValidPostcode(body.postcode!)) {
    return NextResponse.json({ error: "Valid UK postcode is required" }, { status: 400 });
  }

  const depositAmount = body.depositAmount ?? 0;
  const totalPrice = body.totalPrice ?? 0;

  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        service: body.service,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        frequency: body.frequency,
        postcode: body.postcode,
        address: body.address,
        booking_date: body.bookingDate,
        booking_time: body.bookingTime,
        extras: body.extras ?? [],
        base_price: body.basePrice ?? 0,
        extras_price: body.extrasPrice ?? 0,
        total_price: totalPrice,
        deposit_amount: depositAmount,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        notes: body.notes,
        status: "confirmed",
        deposit_paid: true,
      })
      .select("id")
      .single();

    if (error) throw error;

    // Stripe integration: if STRIPE_SECRET_KEY is configured, create a real
    // PaymentIntent. Otherwise return a mock client secret so the booking
    // flow completes. When Stripe keys are added, real payments activate.
    let clientSecret: string;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey) {
      const stripe = (await import("stripe")).default;
      const stripeClient = new stripe(stripeKey);
      const intent = await stripeClient.paymentIntents.create({
        amount: depositAmount,
        currency: "gbp",
        metadata: { booking_id: data.id },
        automatic_payment_methods: { enabled: true },
      });
      clientSecret = intent.client_secret!;

      await supabase
        .from("bookings")
        .update({ stripe_payment_intent_id: intent.id })
        .eq("id", data.id);
    } else {
      clientSecret = `mock_pi_secret_${data.id}`;
    }

    return NextResponse.json(
      { ok: true, bookingId: data.id, clientSecret },
      { status: 201 }
    );
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json({ error: "Could not create booking" }, { status: 500 });
  }
}
