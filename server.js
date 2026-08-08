import http from "node:http";
import { cartTotal } from "./cart.js";

const PORT = process.env.PORT ?? 4000;

const CART_ITEMS = [
  {
    name: "Standing Desk",
    description: "Electric sit-stand desk, walnut top",
    price: 499,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "Mechanical Keyboard",
    description: "Hot-swappable switches, PBT keycaps",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=60",
  },
  {
    name: "USB-C Cable",
    description: "2m braided, 100W fast charge",
    price: 19,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=60",
  },
];

const STYLES = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    background: linear-gradient(160deg, #f4f6fb 0%, #e8ecf7 100%);
    min-height: 100vh;
    color: #1e2433;
  }
  header {
    background: #101828;
    color: #fff;
    padding: 18px 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  header .logo { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
  header .tagline { color: #9aa4b2; font-size: 13px; }
  main { max-width: 720px; margin: 40px auto; padding: 0 20px; }
  h1 { font-size: 26px; margin-bottom: 20px; }
  .card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 4px 18px rgba(16, 24, 40, 0.08);
    overflow: hidden;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 22px;
    border-bottom: 1px solid #eef1f6;
  }
  .item img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 10px;
    background: #eef1f6;
  }
  .item .info { flex: 1; }
  .item .name { font-weight: 600; font-size: 16px; }
  .item .desc { color: #667085; font-size: 13px; margin-top: 3px; }
  .item .price { font-weight: 600; font-size: 16px; text-align: right; }
  .item .saving { color: #12805c; font-size: 12px; display: block; margin-top: 3px; }
  .summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 22px;
    background: #fafbfd;
  }
  #cart-total { font-size: 20px; font-weight: 700; }
  #pay-button {
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 28px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  #pay-button:hover { background: #4338ca; }
  #checkout-error {
    color: #b42318;
    background: #fef3f2;
    border: 1px solid #fecdca;
    border-radius: 10px;
    padding: 12px 18px;
    font-weight: 600;
  }
  footer { text-align: center; color: #98a2b3; font-size: 12px; margin: 30px 0; }
`;

function renderItem(item) {
  const saving =
    typeof item.discount === "number" && item.discount > 0
      ? `<span class="saving">Save $${item.discount.toFixed(2)}</span>`
      : "";
  return `<div class="item">
    <img src="${item.image}" alt="${item.name}" />
    <div class="info">
      <div class="name">${item.name}</div>
      <div class="desc">${item.description}</div>
    </div>
    <div class="price">$${item.price.toFixed(2)}${saving}</div>
  </div>`;
}

function renderCheckout() {
  let total;
  try {
    total = cartTotal(CART_ITEMS);
  } catch {
    total = undefined;
  }
  const totalIsValid = typeof total === "number" && Number.isFinite(total);
  const totalDisplay = totalIsValid ? `$${total.toFixed(2)}` : String(total);
  const payButton = totalIsValid
    ? `<button id="pay-button">Pay ${totalDisplay}</button>`
    : `<p id="checkout-error">Unable to complete checkout right now.</p>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Acme Store — Checkout</title>
  <style>${STYLES}</style>
</head>
<body>
  <header>
    <span class="logo">Acme Store</span>
    <span class="tagline">Gear for better workdays</span>
  </header>
  <main>
    <h1>Checkout</h1>
    <div class="card">
      ${CART_ITEMS.map(renderItem).join("\n      ")}
      <div class="summary">
        <p id="cart-total">Total: ${totalDisplay}</p>
        ${payButton}
      </div>
    </div>
  </main>
  <footer>Acme Store — demo checkout monitored by Patchline</footer>
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
