# Form studio

The `/form-builder` route implements the emerald-and-cream studio from the supplied Figma Make reference:
https://www.figma.com/make/avUG3VIDUK7EGlCqIqYJoN/High-Fidelity-UI-UX-Mockup

The layout uses a 288px field palette, a flexible dotted canvas, and a 320px settings inspector on desktop. Smaller screens stack the inspector and then the palette. Typography uses Plus Jakarta Sans with the existing local Inter font as fallback. Existing makeForm branding and account routes are retained.

## Editing

- A fresh session opens the nine-field onboarding sample. Templates remain accessible in the status bar and footer, and existing `?template=` links still work.
- Click or drag a palette item to add it. Use card actions or drag to reorder, duplicate, and remove fields. Keyboard users can focus a card and use its labeled action buttons.
- Edit the form header with its pencil button. Select a field to edit General, Rules, Options (choice fields), or Logic settings.
- Changes automatically save to the existing session-storage draft key. Only one draft is retained per browser tab. Storage failures show an error without discarding the in-memory form.
- Undo retains the last 30 edits for this page session. Reset restores the source template and can be undone.

## Preview behavior

Number fields can specify a positive step increment, based on their minimum or zero. Leaving step blank permits any number. Single agreement checkboxes have a checked-by-default control; checkbox groups remain unselected by default.

The example-error toggle demonstrates the mockup's error styling without changing answers. Submitting runs real validation and exits demonstration mode. Conditions can either show or hide a field when matched; older drafts default to show. Descendants of a hidden dependency remain hidden.

The template gallery also offers a blank canvas. Resetting a blank form restores its empty starter, and blank drafts use the same browser-tab storage as other templates.

Live Preview supports all nine palette types plus the existing telephone fields. Required, numeric, text-length, choice, email, and file constraints are checked on test submission. File selection is local: only file metadata appears in the test payload, and nothing is uploaded. No production response endpoint is introduced.

A required checkbox group needs at least one selected option; a single agreement checkbox must be checked. Defaults are applied when a new preview mounts. Hidden fields are excluded from validation and the test payload.

Conditional rules reference preceding non-file fields. Removing a dependency or moving it after its dependent clears the affected condition. Hidden ancestors also hide descendants, even when stale answers remain in memory.

## Verification

The second design pass adds a sticky desktop header, selected-card highlights, recoverable palette search, keyboard-operated settings tabs, and a mobile panel jump bar. Preview includes an error summary with field focus links, a file dropzone with local file metadata and removal, and a repeat-test action that clears answers and file selections. Choice renaming preserves the default, new option names avoid duplicates, and drag slots consistently mean “insert before this card.”

Run `npm run typecheck`, `npm run build`, `npm run test:templates`, and `npm run test:studio` (Node 24 for the test runner's TypeScript loader).

Browser checks cover desktop and 390px mobile layout, field editing, duplication, deletion, undo, reorder persistence after reload, required validation errors, and a successful test submission. The existing background gradient now uses React's stable `useId` to avoid server/client hydration mismatches.

The Figma connector returned a source-file inventory but its resource reader failed. Implementation was grounded in the interactive Figma preview, rendered DOM styles, and visible design details. No Theme or JSON toolbar was added: the latest reference revision removes those controls.

## Shared header and completion pass (September 2026)

All routed application pages use `Headers.tsx`. The separate studio navbar was removed. The shared header retains the existing makeForm logo and account actions, indicates the current page, and accepts studio preview/reset/undo/redo callbacks. Its mobile menu closes on navigation or Escape and restores focus to the menu toggle.

- Undo and redo retain up to 30 edits in this page session. Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, and Ctrl+Y work in the editor while preserving native text-input undo. A new edit clears redo history; changing templates starts a new history.
- Template browsing links open `/form-builder?view=templates`. Home and standalone preview share the mockup's product/account/resources footer.
- Draft loading rejects duplicate or empty field IDs and repairs dangling, forward, or file-based conditions. Renaming a unique choice preserves exact dependent comparisons; switching a condition's source clears the previous comparison value.
- Preview validates actual calendar dates. After the first test submission, errors update as answers change. Upload metadata remains visible if a conditional upload field hides and reappears; hidden fields remain excluded from validation and payloads. Upload limits may use fractional MB.
- Restarting a successful test restores defaults, removes files and errors, and focuses the first field visible under the restored defaults.
- Account tabs use real route links and no longer depend on unimplemented callbacks. Google sign-in is explicitly disabled because the project has no configured Google authentication flow. Email authentication still requires the existing backend; this pass did not exercise account creation or send verification email.

Verification: TypeScript check, client/server production build, and all 24 studio/template tests passed. Browser checks covered the landing-to-gallery link, template loading, add/undo/redo, required and email errors updating live, successful local test submission, repeat-test focus, desktop studio layout, a single header, 390px mobile layout without horizontal overflow, mobile menu Escape dismissal, and registration/sign-in routing. No browser console errors were observed during these checks.

The Figma Make source resource reader remained unavailable. The existing implementation was retained and checked against the interactive reference; no new design assets or removed Theme/JSON controls were introduced. Production form submission and Google OAuth remain outside this local-preview implementation.
