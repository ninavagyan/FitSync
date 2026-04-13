import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function GET(_request: Request, { params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  return NextResponse.json({ trainingId, items: await adminService.getTrainingRoster(trainingId) });
}
