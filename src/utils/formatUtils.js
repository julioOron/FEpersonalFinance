export function formatCurrency(value) {
    if (value == null || isNaN(value)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  