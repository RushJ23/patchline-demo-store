/**
 * Payment-count state, shared across serverless instances when a Redis REST
 * store is configured (Vercel Marketplace Upstash / Vercel KV env vars).
 * Falls back to in-memory state for local runs.
 */
const REDIS_URL =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const KEY = "patchline-demo:payment-count";

let memoryCount = 0;

async function redis(...command) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error(`Redis error ${res.status}: ${await res.text()}`);
  }
  const body = await res.json();
  return body.result;
}

const hasRedis = Boolean(REDIS_URL && REDIS_TOKEN);

export async function getPaymentCount() {
  if (!hasRedis) return memoryCount;
  const value = await redis("GET", KEY);
  return value ? Number(value) : 0;
}

export async function incrementPaymentCount() {
  if (!hasRedis) return ++memoryCount;
  return Number(await redis("INCR", KEY));
}

export async function resetPaymentCount() {
  if (!hasRedis) {
    memoryCount = 0;
    return;
  }
  await redis("SET", KEY, "0");
}
