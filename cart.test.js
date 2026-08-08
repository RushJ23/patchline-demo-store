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

test("repeat-customer discount keeps discounts finite", () => {
  const items = applyRepeatCustomerDiscount([{ name: "Desk", price: 499 }, { name: "Cable", price: 19 }]);
  assert.ok(items.every((item) => Number.isFinite(item.discount)));
});

test("repeat-customer discount adds 10% on top of the base discount", () => {
  const [desk, cable] = applyRepeatCustomerDiscount([{ name: "Desk", price: 499 }, { name: "Cable", price: 19 }]);
  assert.equal(desk.discount, 499 * 0.1 + 499 * 0.1);
  assert.equal(cable.discount, 19 * 0.1);
});

test("total stays finite after repeat-customer discount is applied", () => {
  const items = applyRepeatCustomerDiscount([{ name: "Desk", price: 499 }, { name: "Cable", price: 19 }]);
  assert.equal(cartTotal(items), 499 - 99.8 + 19 - 1.9);
});
