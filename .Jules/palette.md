
## 2024-05-19 - Missing Form Accessibility Attributes in Manual Forms
**Learning:** React Hook Form usage without UI component libraries (like Radix or MUI) in this codebase often lacks explicit label binding (`htmlFor`/`id`) and screen reader validation context (`aria-invalid`/`aria-describedby`) for dynamically rendered inline error messages. This makes form validation issues invisible to assistive technologies.
**Action:** Always ensure manually constructed `<input>` elements have unique `id`s bound to their `<label>`s via `htmlFor`. When rendering inline errors (e.g., `{errors.field && <p>...}`), apply `aria-invalid={!!errors.field}` and `aria-describedby="field-error"` to the input, and ensure the error `<p>` tag has the corresponding `id="field-error"`.
