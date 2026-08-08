import test from "node:test";
import assert from "node:assert/strict";
import { cartTotal, calculateDiscount } from "./cart.js";

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
