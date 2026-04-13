import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function GET() {
  return NextResponse.json({ items: await adminService.listTrainers() });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = await request.json();
    const trainer = await adminService.createTrainer({
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      active: Boolean(payload.active ?? true),
      specialties: payload.specialties ?? [],
    });
    return NextResponse.json(trainer, { status: 201 });
  }

  const formData = await request.formData();
  await adminService.createTrainer({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    active: String(formData.get("active") ?? "active") === "active",
    specialties: String(formData.get("specialties") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });
  return NextResponse.redirect(toRequestUrl(request, "/trainers"));
}
