export function nextOrderCode(count: number) {
  return `ED${String(count + 1).padStart(3, "0")}`;
}
