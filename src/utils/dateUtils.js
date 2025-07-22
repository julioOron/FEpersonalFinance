import { format } from "date-fns";

export function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return format(date, "yyyy/MM/dd HH:mm:ss");
}
