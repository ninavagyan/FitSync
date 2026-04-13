import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function PATCH(request: Request, { params }: { params: Promise<{ trainerId: string }> }) {
  const payload = await request.json();
  const { trainerId } = await params;
  const trainer = await adminService.updateTrainer(trainerId, payload);
  if (!trainer) {
    return NextResponse.json({ error: { code: "not_found", message: "Trainer not found." } }, { status: 404 });
  }
  return NextResponse.json(trainer);
}
