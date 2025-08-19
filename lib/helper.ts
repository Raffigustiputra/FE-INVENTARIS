export const statusClass = (status: string) => {
  switch ((status || "").toUpperCase()) {
    case "AVAILABLE":
      return "bg-green-200 text-green-700";
    case "BORROWED":
      return "bg-[#FFF3A4] text-[#978611]";
    case "UNAVAILABLE":
      return "bg-red-200 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export const conditionClass = (condition: string) => {
  switch ((condition || "").toUpperCase()) {
    case "GOOD":
      return "bg-[#D2F3D8] text-[#59AE75]";
    case "DAMAGED":
      return "bg-red-200 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const toUpperCase = (str: string) => (str ? String(str).toUpperCase() : "");

export function darkenColor(hex: string, percent: number) {
  if (!hex) return "#000";
  let num = parseInt(hex.slice(1), 16),
    r = (num >> 16) - percent,
    g = ((num >> 8) & 0x00ff) - percent,
    b = (num & 0x0000ff) - percent;
  return (
    "#" +
    (
      0x1000000 +
      (r < 0 ? 0 : r) * 0x10000 +
      (g < 0 ? 0 : g) * 0x100 +
      (b < 0 ? 0 : b)
    )
      .toString(16)
      .slice(1)
  );
}

export const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};