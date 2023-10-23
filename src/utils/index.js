export const getFormattedHNL = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HNL"
  }).format(amount)
}
