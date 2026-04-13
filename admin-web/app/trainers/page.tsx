import { redirect } from "next/navigation";

export default function LegacyTrainersRedirect() {
  redirect("/admin/trainers");
}
