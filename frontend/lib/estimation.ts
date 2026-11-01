export function estimateCabs(
  share: number,
  tripsPerRider: number,
  tripsPerCab: number,
) {
  const riders = (20_000_000 * share) / 100;
  const trips = riders * tripsPerRider;
  return { riders, trips, cabs: trips / tripsPerCab };
}
export function formatEstimate(value: number) {
  return value >= 1e7
    ? (value / 1e7).toFixed(1) + " crore"
    : value >= 1e5
      ? (value / 1e5).toFixed(1) + " lakh"
      : Math.round(value).toLocaleString("en-IN");
}
