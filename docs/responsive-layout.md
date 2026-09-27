# Responsive layout

The application keeps `Headers.tsx` as its only routed application header. Responsive changes cover the landing page, template gallery, studio, preview, sign-in, registration, verification code entry, and shared footer.

## Layout rules

- Below 768px, studio panels stack with a sticky Fields/Canvas/Settings jump bar. Palette cards use two columns on small phones and three from 480px. Field actions wrap; editor and preview controls have larger touch targets.
- From 768px to 1279px, the palette and canvas share a row, with settings below. Palette categories use two columns to avoid clipping in the narrower sidebar.
- From 1280px, the studio uses three columns and the header shows desktop navigation. At 1920px the side panels widen while form content remains bounded. Short desktop viewports use document scrolling instead of nested panels.
- The mobile menu scrolls independently when screen height is limited. Menus, footer links, preview buttons, and phone editor actions provide at least 44px interaction height where targeted.
- Mobile and coarse-pointer text inputs use 16px text. Form labels, descriptions, errors, choice settings, upload names, and response payloads wrap within their containers.
- OTP slots share available width instead of requiring six fixed-width boxes. Footers collapse from four columns to two, then one on small phones.
- Landing typography scales fluidly; cards switch from one to two to three columns. Safe-area spacing and reduced-motion rules apply without disabling browser zoom.

## Verification

Checked rendered browser layouts at 320×568, 390×844, 667×375, 768×1024, 1024×768, 1366×768, and 1920×1080. Landing, studio, gallery, integrated preview with validation errors, registration, and sign-in had no horizontal document overflow at these sizes. Additional studio checks at 1280×800, 1440×900, and 1366×500 covered breakpoint edges and short-desktop scrolling.

Interaction checks covered phone panel navigation and focus, the options editor, long unbroken labels/placeholders, and the short-landscape header menu. The tablet category clipping found during visual review was corrected. Browser checks reported no console errors.

OTP geometry was checked at the same seven sizes using server-rendered markup from the real production route component, wrapped in its router and query providers and served with production CSS. All six slots fit without overflow. This was a static layout check, not a test of sending or verifying email.

TypeScript checking, the client/server production build, and all 27 studio/template tests passed. Viewport emulation does not replace testing Safari, Android, or physical devices; device-specific keyboard and safe-area behavior should be included in release QA.

## Repeat checks

Run `npm run typecheck`, `npm run build`, `npm run test:studio`, and `npm run test:templates`. Start the app with `npm run dev`, then inspect the sizes above using browser responsive mode. Check long content, a selected field's Options tab, preview errors, open mobile navigation, and the footer in addition to the initial viewport. Verify scrollable panels remain reachable with keyboard and touch.
