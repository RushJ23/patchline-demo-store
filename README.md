# Patchline Demo Store

The demo checkout app monitored and repaired by [Patchline](https://github.com/RushJ23/Patchline) — the AI on-call engineer. This is the repo Devin investigates and opens PRs against; the Patchline backend owns merging.

## Run

```bash
npm start    # checkout on :4000
npm test     # regression tests (run in CI)
```

## Demo: break production

No deploy needed — press **Pay** twice. The second payment triggers the buggy `applyRepeatCustomerDiscount` in `cart.js` (`item.price * "10%"` is `NaN`), corrupting the cart: the total renders `NaN`, the pay button disappears, and the checkout shows an error. Then fire an incident at the Patchline server (see the Patchline README) and let it repair this repo.

Visit `/reset` to restore the cart between demo runs. (State is in-memory; on serverless hosting it lives per warm instance.)

## Safety setup

`main` is branch-protected: PRs + green CI required, no direct pushes. Devin only gets branch/PR permissions; only the Patchline backend's token can merge.

