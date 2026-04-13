## 2024-04-13 - Form Accessibility (Login & Register)
**Learning:** Found that custom React Hook Form inputs were completely lacking structural associations (`htmlFor`/`id`) and ARIA properties (`aria-invalid`/`aria-describedby`) for communicating error states and input focus securely to assistive technologies.
**Action:** Ensure that manually constructed forms always bind labels to inputs via `htmlFor`/`id` pairs and use `aria-describedby` when inline validation errors are rendered, providing crucial context for screen readers.
