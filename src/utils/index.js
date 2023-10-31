export function getFormattedHNL(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HNL"
  }).format(amount)
}

export function bytesToMB(bytes) {
  const megabytes = bytes / (1024 * 1024)
  return megabytes.toFixed(2)
}
