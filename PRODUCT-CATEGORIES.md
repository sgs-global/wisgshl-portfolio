# Product category content

The homepage section is maintained in `components/ProductCategories.tsx` and styled by `components/ProductCategories.module.css`. Its existing `divisions` anchor is preserved for navigation. Explore Products links open the existing contact page for a conversation with the manufacturing team; no public product detail pages or catalog are available in this checkout.

## Photographs needed

Supply one approved, genuine catalog photograph per category. Suggested paths:

- `public/images/products/portable-power-stations.webp`
- `public/images/products/solar-street-lights.webp`
- `public/images/products/led-street-lights.webp`
- `public/images/products/led-floodlights.webp`
- `public/images/products/led-strip-lights.webp`

The existing composite illustrations and company video cover are not verified category photographs. The section deliberately shows labeled placeholders until approved photographs are supplied.

Use clean backgrounds and consistent framing, preferably at least 1200 × 900 pixels. Do not include prices, quotation tables, purchasing details, or other confidential commercial information in images or metadata.

## Replace a placeholder

Create `public/images/products/`, add the approved photograph, and replace the relevant category's `image: null` value in `components/ProductCategories.tsx` with:

```tsx
image: {
  src: "/images/products/portable-power-stations.webp",
  alt: "WISGSHL portable power station, front and side view",
},
```

Adapt the alt text to the actual photograph. The component uses `object-fit: contain` to keep the entire product visible. Photos share a 4:3 display area. Keep `image: null` for any category without an approved photo.

## Catalog verification

No product catalog was found in the project. Descriptions use only the general category and application information in the supplied brief. Confirm them against the current catalog before publishing. Each category has an empty `highlights` array: add three concise highlights only after verification. Verify battery chemistry and capacity, charging compatibility, connectors, wattages, waterproof ratings, certifications, model numbers, and OEM/ODM availability before making those claims. None of these technical claims or any prices were added to the section.

Changes are local only; no deployment was performed.
