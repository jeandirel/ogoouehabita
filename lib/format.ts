export function formatFcfa(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;
}

export function formatXaf(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(amount)} XAF`;
}

export function formatCompactFcfa(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}M FCFA`;
  }
  return formatFcfa(amount);
}

// Extracts a max-budget threshold (in FCFA) from free-text budget option
// labels like "150 000 000", "Jusqu'à 300 000 FCFA / mois" or "Tous budgets"
// (no digits -> no threshold, i.e. unfiltered).
export function parseBudgetLabel(value?: string): number | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

// Normalizes a loosely-formatted Gabonese phone number ("+241 74 01 02 03",
// "074010203", "74 01 02 03"...) into wa.me's expected digits-only,
// country-code-prefixed form (e.g. "24174010203").
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("241")) return digits;
  if (digits.startsWith("0")) return `241${digits.slice(1)}`;
  return `241${digits}`;
}

export function formatLocalDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
