/**
 * Cart total calculation for the demo checkout.
 *
 * DEMO NOTE: this file is where the "4 a.m. incident" bug gets introduced.
 * To break production for the demo, deploy a change that assumes
 * `item.discount` always exists (e.g. remove the fallback below), which makes
 * the displayed total "undefined" and hides the pay button.
 */
export function calculateDiscount(item) {
  return item.price >= 100 ? item.price * 0.1 : 0;
}

export function cartTotal(items) {
  return items.reduce((total, item) => {
    const discount = item.discount ?? calculateDiscount(item);
    return total + item.price - discount;
  }, 0);
}
