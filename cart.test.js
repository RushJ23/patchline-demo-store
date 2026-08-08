import test from "node:test";
import assert from "node:assert/strict";
import { cartTotal, calculateDiscount, applyRepeatCustomerDiscount } from "./cart.js";

test("applies explicit discounts", () => {
  assert.equal(cartTotal([{ name: "Desk", price: 499, discount: 50 }]), 449);
});

test("falls back to calculateDiscount when discount is missing", () => {
  assert.equal(cartTotal([{ name: "Keyboard", price: 149 }]), 149 - calculateDiscount({ price: 149 }));
});

test("zero discount is respected", () => {
  assert.equal(cartTotal([{ name: "Cable", price: 19, discount: 0 }]), 19);
});

test("total is always a finite number", () => {
  const total = cartTotal([{ name: "Desk", price: 499, discount: 50 }, { name: "Keyboard", price: 149 }]);
  assert.ok(Number.isFinite(total));
});

test("repeat-customer discount adds 10% of price to the existing discount", () => {
  const items = applyRepeatCustomerDiscount([
    { name: "Desk", price: 499, discount: 50 },
    { name: "Keyboard", price: 149 },
    { name: "Cable", price: 19, discount: 0 },
  ]);
  const expected = [50 + 49.9, calculateDiscount({ price: 149 }) + 14.9, 1.9];
  items.forEach((item, i) => assert.ok(Math.abs(item.discount - expected[i]) < 1e-9));
});

test("total stays finite after the repeat-customer discount", () => {
  const items = applyRepeatCustomerDiscount([
    { name: "Desk", price: 499, discount: 50 },
    { name: "Keyboard", price: 149 },
    { name: "Cable", price: 19, discount: 0 },
  ]);
  assert.ok(Number.isFinite(cartTotal(items)));
});

test("repeat-customer discount is idempotent in type, never NaN when applied twice", () => {
  const items = [{ name: "Desk", price: 499, discount: 50 }];
  applyRepeatCustomerDiscount(items);
  applyRepeatCustomerDiscount(items);
  assert.ok(Number.isFinite(items[0].discount));
  assert.ok(Number.isFinite(cartTotal(items)));
});
