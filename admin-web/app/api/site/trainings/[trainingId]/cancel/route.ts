import { NextResponse } from "next/server";
import { getCurrentCustomerUser } from "@/lib/server/customer-web-session";
import { toRequestUrl } from "@/lib/server/request-url";
import { adminService } from "@/lib/server/services";

export async function POST(request: Request, context: { params: Promise<{ trainingId: string }> }) {
  const user = await getCurrentCustomerUser();
  const formData = await request.formData();
  const redirectTo = String(formData.get("redirectTo") ?? "/bookings");

  if (!user || user.role !== "customer") {
    return NextResponse.redirect(toRequestUrl(request, `/login?redirect=${encodeURIComponent(redirectTo)}`));
  }

  const { trainingId } = await context.params;

  try {
    await adminService.cancelTrainingBookingForCustomer(trainingId, user.id);
    return NextResponse.redirect(toRequestUrl(request, `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}success=${encodeURIComponent("Booking cancelled.")}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cancellation failed.";
    return NextResponse.redirect(toRequestUrl(request, `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`));
  }
}
