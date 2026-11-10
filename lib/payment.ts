export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function luhnValid(cardNumber: string) {
  const digits = digitsOnly(cardNumber);
  if (!/^\d{16}$/.test(digits)) return false;
  let sum = 0;
  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function cardBrand(cardNumber: string) {
  const digits = digitsOnly(cardNumber);
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "American Express";
  return "Tarjeta";
}

export function expiryValid(value: string, now = new Date()) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const end = new Date(year, month, 1);
  return end > now;
}
