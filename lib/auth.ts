import type { Account } from "@/lib/types";

export const DEMO_ACCOUNTS: Account[] = [
  {
    email: "cliente@luxtime.com",
    password: "atelier1940",
    name: "Clara Moreau",
    role: "customer",
  },
  {
    email: "atelier@luxtime.com",
    password: "calibre1940",
    name: "Santiago Gallo",
    role: "admin",
  },
];

export function matchAccount(accounts: Account[], email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  return (
    accounts.find((account) => account.email === normalized && account.password === password) ??
    null
  );
}
