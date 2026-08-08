import http from "node:http";
import { cartTotal } from "./cart.js";

const PORT = process.env.PORT ?? 4000;

const CART_ITEMS = [
  { name: "Standing Desk", price: 499, discount: 50 },
  { name: "Mechanical Keyboard", price: 149 },
  { name: "USB-C Cable", price: 19, discount: 0 },
];

function renderCheckout() {
  let total;
  try {
    total = cartTotal(CART_ITEMS);
  } catch {
    total = undefined;
  }
  const totalDisplay = typeof total === "number" && Number.isFinite(total) ? `$${total.toFixed(2)}` : String(total);
  const payButton =
    typeof total === "number" && Number.isFinite(total)
      ? `<button id="pay-button">Pay ${totalDisplay}</button>`
      : `<p id="checkout-error">Unable to complete checkout right now.</p>`;

  return `<!doctype html>
<html>
<head><title>Acme Store — Checkout</title></head>
<body>
  <h1>Checkout</h1>
  <ul>
    ${CART_ITEMS.map((item) => `<li>${item.name} — $${item.price.toFixed(2)}</li>`).join("\n    ")}
  </ul>
  <p id="cart-total">Total: ${totalDisplay}</p>
  ${payButton}
</body>
</html>`;
}

http
  .createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderCheckout());
  })
  .listen(PORT, () => console.log(`Demo checkout on :${PORT}`));
