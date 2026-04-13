import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function POST(_request: Request, { params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  const training = await adminService.cancelTraining(trainingId);
  if (!training) {
    return NextResponse.json({ error: { code: "not_found", message: "Training not found." } }, { status: 404 });
  }
  return NextResponse.json(training);
}
