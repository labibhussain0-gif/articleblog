## 2026-04-10 - [Newsletter Form Accessibility & UX]
**Learning:** Manually constructed forms in this application, like the newsletter subscription in the Footer, often lack proper loading state UI during async requests and `aria-label` attributes on inputs without an explicit `<label>`. This causes a poor experience for screen reader users and those triggering slow requests.
**Action:** Always ensure manually built forms contain an explicit disabled/loading state (e.g. `isSubmitting`, `isSubscribing`) and that any form input without a `<label>` receives a descriptive `aria-label`.
