# Inside SGS: photographs, sliders and scroll effects

## Source of truth

All photographs are discovered from `public/images/assets/inside_sgs/`. Originals are never renamed, replaced or edited. The former `public/images/inside-sgs/` copy is no longer referenced by this section.

`components/insideSgsImages.server.ts` reads directory entries on the server during local rendering/static builds. Matching names are `team_NUMBER`, `development_NUMBER`, `quality_NUMBER`, `production_NUMBER`, and `supply_NUMBER`, with JPG, JPEG, PNG or WebP extensions (case-insensitive). Exact filename casing and extensions are retained in browser URLs. Entries are naturally sorted, so `_2` precedes `_10`.

No browser filename guessing, network probes, availability flags, dropdowns or layout switches are used. Real discovered images render in the initial HTML. A placeholder is used only for an empty category or if all of its image requests fail.

## Current inventory

| Category | Source files | Slider |
| --- | --- | --- |
| Team | team_1.jpg | Single image with original expand-to-view interaction |
| Development | development_1.png, development_2.png | 2 images |
| Quality | quality_1.png, quality_2.jpg | 2 images |
| Production | production_1.jpg through production_4.jpg | 4 images |
| Supply | supply_1.png through supply_3.png | 3 images |

The supplied production and quality photographs remain grouped by your filenames. Alt text describes their visible content without inferring certifications or facilities. Alt overrides live in `components/insideSgsConfig.ts`; future photographs receive a neutral category description until a more precise description is added there.

## Adding photographs

Add approved real photographs to `public/images/assets/inside_sgs/` using the prefix and numeric suffix above. No manual array edits are required. Refresh in local development. For the static production site, rebuild with `npm.cmd run build` and upload the updated export: additional filenames cannot be discovered from the browser on an already deployed static host. Originals should be compressed appropriately before uploading; existing originals have been preserved.

## Interaction and loading

Each category owns its selected photograph, visited slides, loading state and error handling. One image hides controls; multiple images show bottom-left dots (white active pill), bottom-right circular arrows and an image counter. Arrows wrap at both ends. Click dots or use Left/Right/Home/End while focused on the region. Horizontal touch swipes change slides while vertical page scrolling stays available. There is no autoplay.

The first team photograph is preloaded. Other category images are lazy-loaded; additional slides mount when selected and stay mounted for smooth subsequent crossfades. The preceding loaded image remains visible while the next loads. Failed requests are excluded without affecting other sliders. Stable landscape frames prevent layout shifts; contain fitting preserves the full subject. The team frame preserves all eight people, avoids hover cropping and retains its keyboard-accessible native lightbox. Future team photographs automatically participate in its slider too.

## Scroll effects

IntersectionObserver reveals each image once with opacity, restrained upward movement and scale from .97 to 1 (mobile .99 to 1). The label, heading, description and link follow with a short stagger. The closing CTA also reveals once.

A single existing GSAP ScrollTrigger controller caches category centers during refresh and marks only the category nearest the viewport center as active. It updates classes only when that index changes, supports reverse scroll, and avoids competing per-category triggers. Active text and border accents transition subtly. No frame-by-frame layout measurements or React scroll-state updates are used. All observers, media listeners and triggers are cleaned up.

Reduced-motion preferences show content immediately, disable movement and remove meaningful transition duration. CSS and the observer respond to preference changes without reloading. Content remains present and readable if JavaScript is unavailable.

## Verification

`npm.cmd run build` checks compilation, TypeScript and static export. `scripts/verify-inside-sgs.mjs` exercises the actual site with Chrome DevTools Protocol without adding dependencies. Start a local server for `out` on port 8765 and a headless Chrome session with CDP on port 9229, then run `node scripts/verify-inside-sgs.mjs`. The script checks navigation, independent state, loaded images, active-category transfer, team dialog and focus return, touch swipe, 768/390/320px layouts, reduced motion and each exact image URL. Screenshots are written to `artifacts/`.

Only Inside SGS and its supporting files were changed. No deployment was performed.
