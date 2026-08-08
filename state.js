/**
 * Payment-count state shared across all serverless instances via a free,
 * keyless public counter service (abacus.jasoncameron.dev) — no credentials
 * or store setup required.
 *
 * Counters can only be incremented, so reset works via epochs: a "resets"
 * counter picks which "pays-<epoch>" counter is active; bumping it starts a
 * fresh payment count at zero.
 *
 * Falls back to in-memory state if the counter service is unreachable.
 */
const BASE = "https://abacus.jasoncameron.dev";
const NAMESPACE = "patchline-demo-store-rushj23";

let memoryCount = 0;

async function counter(action, key) {
  const res = await fetch(`${BASE}/${action}/${NAMESPACE}/${key}`);
  if (res.status === 404) return 0;
  if (!res.ok) {
    throw new Error(`Counter service error ${res.status}`);
  }
  const body = await res.json();
  return Number(body.value ?? 0);
}

async function currentEpoch() {
  return counter("get", "resets");
}

export async function getPaymentCount() {
  try {
    const epoch = await currentEpoch();
    return await counter("get", `pays-${epoch}`);
  } catch {
    return memoryCount;
  }
}

export async function incrementPaymentCount() {
  try {
    const epoch = await currentEpoch();
    return await counter("hit", `pays-${epoch}`);
  } catch {
    return ++memoryCount;
  }
}

export async function resetPaymentCount() {
  memoryCount = 0;
  try {
    await counter("hit", "resets");
  } catch {
    // in-memory fallback already reset
  }
}
