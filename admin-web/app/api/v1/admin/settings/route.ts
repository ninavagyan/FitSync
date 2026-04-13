import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function GET() {
  return NextResponse.json(await adminService.getSettings());
}

export async function PATCH(request: Request) {
  const payload = await request.json();
  return NextResponse.json(await adminService.updateSettings(payload));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  await adminService.updateSettings({
    timezone: String(formData.get("timezone") ?? "Asia/Yerevan"),
    bookingCutoffMinutes: Number(formData.get("bookingCutoffMinutes") ?? 90),
    cancellationCutoffMinutes: Number(formData.get("cancellationCutoffMinutes") ?? 120),
    waitlistEnabled: String(formData.get("waitlistEnabled") ?? "yes") === "yes",
    notificationsEnabled: String(formData.get("notificationsEnabled") ?? "yes") === "yes",
  });
  return NextResponse.redirect(toRequestUrl(request, "/settings"));
}
