# Authentication regression checks

Run npm test for all local regression tests, or npm run test:auth for request handling and resend timing. These tests use an in-memory Axios adapter; they do not contact an authentication service or send verification emails.

Requests use a 30-second default timeout. Callers can override it, including zero to disable it. Public account endpoints omit saved bearer tokens, while explicit Authorization headers take precedence. Restricted browser storage does not prevent public requests. Cancellation retains Axios cancellation identity; other failures expose a string message and validated field-error arrays.

OTP verification and resending disable one another while pending. Resend timing uses an absolute deadline and refreshes when the tab becomes visible. The displayed timer describes resending, not server-side code expiration. Missing email context returns to registration without leaving a broken verification route in browser history.

The shared Headers.tsx component remains the only application header. Live email delivery and successful account authentication still require testing against the configured backend.
