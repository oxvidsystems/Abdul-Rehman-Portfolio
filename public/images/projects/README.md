# Project screenshots

**Status: all 14 captured on 2026-08-28** from the live sites via the
Claude-in-Chrome browser, and wired into `src/lib/projects.ts`. Replace
any of them by dropping a new capture over the same filename and
updating that project's `preview.capturedAt`.

Filenames must match the project `id` in `src/lib/projects.ts` exactly:

| # | file | site |
|---|------|------|
| 01 | `jaffar-enclave.jpg`            | https://jaffarenclave-test.web.app/ |
| 02 | `my-coffee-shop.jpg`            | https://my-coffee-shop-oxvid.web.app/ |
| 03 | `hr-cart-llc.jpg`               | https://hrcartllc.web.app/ |
| 04 | `rising-crescent.jpg`           | https://risingcrescent.co.uk/ |
| 05 | `dreams-nw.jpg`                 | https://www.dreamsnw.com/ |
| 06 | `vivid-dental.jpg`              | https://www.vividdental.ca/ |
| 07 | `jackson-family-dental.jpg`     | https://jacksonfamilydentalonline.com/ |
| 08 | `the-ogden.jpg`                 | https://www.theogdenver.com/ |
| 09 | `federalist-pig.jpg`            | https://www.federalistpig.com/ |
| 10 | `emily-g-artistry.jpg`          | https://emilygartistry.com/ |
| 11 | `elitega-services.jpg`          | https://elitegaservicesllc.net/ |
| 12 | `bradley-home-buyers.jpg`       | https://bradleyhomebuyers.com/ |
| 13 | `aspen-building-solutions.jpg`  | https://aspen-buildingsolutions.co.uk/ |
| 14 | `elite-kitchen-remodels.jpg`    | https://elitekitchenremodelsplano.com/ |

**Recommended capture:** browser window at 1440×900, scrolled to the very
top, full page not required — the card crops from the top. Save as JPG,
roughly 1440×900 or 1280×800.

Once the files are here, set each project's `preview` in
`src/lib/projects.ts`:

```ts
preview: {
  src: "/images/projects/federalist-pig.jpg",
  alt: "Federalist Pig homepage",
  width: 1440,
  height: 900,
  capturedAt: "2026-08-28",
},
```

The card swaps from the headline face to the image automatically — no
other change needed.

## Rules

- Genuine captures of the live URL only. Never a mock-up, a render, or an
  illustration standing in for a screenshot.
- Record `capturedAt`; live sites change and a stale shot presented as
  current is misleading.
- If a site can't be captured, leave `preview: null`. The card falls back
  to that site's own hero headline plus a working "View live site" link.
