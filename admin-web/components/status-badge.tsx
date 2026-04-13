export function StatusBadge({ value }: { value: string }) {
  const className =
    value === "scheduled" || value === "active"
      ? "badge"
      : value === "full"
        ? "badge warning"
        : value === "cancelled" || value === "inactive"
          ? "badge danger"
          : "badge neutral";

  return <span className={className}>{value.replaceAll("_", " ")}</span>;
}
