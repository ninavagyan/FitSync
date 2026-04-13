import { NextResponse } from "next/server";
import { adminService } from "@/lib/server/services";

export async function GET() {
  return NextResponse.json(await adminService.getDashboard());
}
