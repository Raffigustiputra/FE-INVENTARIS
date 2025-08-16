export const statusClass = (status: string) => {
    switch (status) {
        case 'AVAILABLE':
            return 'bg-green-200 text-green-700';
        case 'BORROWED':
            return 'bg-yellow-200 text-yellow-800';
        case 'UNAVAILABLE':
            return 'bg-red-200 text-red-700';
        default:
            return 'bg-gray-200 text-gray-700';
    }
};

export const conditionClass = (condition: string) => {
    switch (condition) {
        case 'GOOD':
            return 'bg-green-200 text-green-700';
        case 'DAMAGED':
            return 'bg-red-200 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

export const conditionText = (condition: string) => {
    switch (condition) {
        case 'damaged': return 'DAMAGED';
        case 'good': return 'GOOD';
        default: return 'UNKNOWN';
    }
};

export const statusText = (status: string, condition: string) => {
    if (condition === 'damaged') return 'UNAVAILABLE';
    switch (status) {
        case 'unavailable': return 'BORROWED';
        case 'available': return 'AVAILABLE';
        default: return 'UNKNOWN';
    }
};

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