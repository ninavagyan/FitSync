import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function PATCH(request: Request, { params }: { params: Promise<{ trainingId: string }> }) {
  const payload = await request.json();
  const { trainingId } = await params;
  const training = await adminService.updateTraining(trainingId, payload);
  if (!training) {
    return NextResponse.json({ error: { code: "not_found", message: "Training not found." } }, { status: 404 });
  }
  return NextResponse.json(training);
}
