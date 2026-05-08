import { NextRequest, NextResponse } from "next/server";
import { contactLeadSchema } from "@/lib/lead-capture/schema";
import { sendLeadByEmail } from "@/lib/lead-capture/email-notifier";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = contactLeadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { name, phone, message, honeypot } = result.data;

  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  try {
    await sendLeadByEmail({ name, phone, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Email send failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Не удалось отправить заявку" }, { status: 500 });
  }
}
