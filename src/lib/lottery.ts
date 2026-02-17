// Weighted random money amount in VND
const AMOUNTS: { value: number; weight: number }[] = [
  { value: 10000, weight: 25 },
  { value: 20000, weight: 20 },
  { value: 50000, weight: 18 },
  { value: 100000, weight: 15 },
  { value: 200000, weight: 10 },
  { value: 300000, weight: 6 },
  { value: 500000, weight: 3 },
  { value: 888000, weight: 1 }, // Super lucky jackpot!
];

export function getRandomAmount(): number {
  const totalWeight = AMOUNTS.reduce((sum, a) => sum + a.weight, 0);
  let random = Math.random() * totalWeight;
  for (const amount of AMOUNTS) {
    random -= amount.weight;
    if (random <= 0) return amount.value;
  }
  return AMOUNTS[0].value;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
}

export function isJackpot(amount: number): boolean {
  return amount >= 300000;
}
