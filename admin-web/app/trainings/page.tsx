import { redirect } from "next/navigation";

export default function LegacyTrainingsRedirect() {
  redirect("/admin/trainings");
}
