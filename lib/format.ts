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
