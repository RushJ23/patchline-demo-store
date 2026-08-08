/**
 * Cart total calculation for the demo checkout.
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

/**
 * Repeat customers get an extra 10% off every item on their next order.
 * Applied once a customer completes their first payment.
 */
export function applyRepeatCustomerDiscount(items) {
  for (const item of items) {
    const base = item.discount ?? calculateDiscount(item);
    item.discount = base + item.price * 0.1;
  }
  return items;
}
