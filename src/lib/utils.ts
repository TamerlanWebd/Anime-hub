export function formatCount(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
export function getDayOfWeek(
  timestamp: number,
  locale: string = "en-US"
): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString(locale, { weekday: "long" });
}

export function getSeason(
  date: Date = new Date()
): "WINTER" | "SPRING" | "SUMMER" | "FALL" {
  const month = date.getMonth();

  if (month >= 0 && month <= 2) {
    return "WINTER";
  } else if (month >= 3 && month <= 5) {
    return "SPRING";
  } else if (month >= 6 && month <= 8) {
    return "SUMMER";
  } else {
    return "FALL";
  }
}
export function getFormattedAiringTime(
  timestamp: number,
  locale: string = "en-US"
): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
