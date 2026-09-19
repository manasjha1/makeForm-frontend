# Prebuilt forms

Open `/form-builder` to search six templates by name or category. Homepage cards
open the selected template directly. Edit the title, description, labels, select
options, and required flags; add text questions or remove fields as needed.

The preview uses native email, required, date, and numeric-bound validation.
Test submission shows a confirmation only: responses are not stored or sent.

**Save draft & preview** stores one form definition in session storage for this
browser tab and opens `/live-preview`. Back to editor restores the saved draft.
Unsaved changes are discarded when switching templates or leaving the editor.
Reset template restores catalog defaults in the editor; save again to replace
the stored draft. Closing the tab ends the draft session.

Templates: Contact Us, Client Onboarding, Event Registration, Customer Feedback
Survey, Job Application, and Appointment Request.

## Validation

- `npm run test:templates` (Node 24+): catalog consistency, isolated editing,
  draft round trips, corrupt data, and unavailable storage.
- `npm run typecheck`
- `npm run build`

Manual browser checks: filter and clear an empty search, open each template,
edit and reset fields, reject an invalid email and out-of-range rating, test a
valid submission, save and refresh the preview, and return to the editor.
Also check narrow screens and keyboard navigation.
