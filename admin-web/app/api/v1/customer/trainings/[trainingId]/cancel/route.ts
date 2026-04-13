import { NextResponse } from "next/server";
import { resolveCustomerApiUser } from "@/lib/server/customer-auth";
import { adminService } from "@/lib/server/services";

export async function POST(request: Request, { params }: { params: Promise<{ trainingId: string }> }) {
  const auth = await resolveCustomerApiUser(request);
  if (auth.error) {
    return auth.error;
  }
  const { trainingId } = await params;
  try {
    return NextResponse.json(await adminService.cancelTrainingBookingForCustomer(trainingId, auth.user.id));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cancellation failed.";
    return NextResponse.json({ error: { code: "cancellation_failed", message } }, { status: 400 });
  }
}
