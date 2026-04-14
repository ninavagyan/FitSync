const statusClassByValue: Record<string, string> = {
  scheduled: "info",
  active: "success",
  full: "warning",
  pending: "warning",
  cancelled: "danger",
  inactive: "danger",
  expired: "neutral-dark",
  draft: "neutral",
  attended: "success",
  missed: "danger",
};

export function getStatusBadgeClass(value: string) {
  const variant = statusClassByValue[value] ?? "neutral";
  return `badge ${variant}`;
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={getStatusBadgeClass(value)}>{value.replaceAll("_", " ")}</span>;
}
