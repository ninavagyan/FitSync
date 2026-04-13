import { NextResponse } from "next/server";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function GET() {
  return NextResponse.json({ items: await adminService.listTrainings() });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = await request.json();
    const training = await adminService.createTraining({
      name: payload.name,
      description: payload.description,
      category: payload.category,
      trainerId: payload.trainerId,
      trainerName: payload.trainerName ?? "",
      startAt: payload.startAt,
      endAt: payload.endAt,
      capacity: Number(payload.capacity),
      bookedCount: Number(payload.bookedCount ?? 0),
      status: payload.status ?? "scheduled",
    });
    return NextResponse.json(training, { status: 201 });
  }

  const formData = await request.formData();
  await adminService.createTraining({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? "pilates"),
    trainerId: String(formData.get("trainerId") ?? "") || null,
    trainerName: "",
    startAt: String(formData.get("startAt") ?? ""),
    endAt: String(formData.get("endAt") ?? ""),
    capacity: Number(formData.get("capacity") ?? 0),
    bookedCount: 0,
    status: String(formData.get("status") ?? "scheduled"),
  });
  return NextResponse.redirect(toRequestUrl(request, "/trainings"));
}
