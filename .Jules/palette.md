
## 2024-04-08 - Dynamic Text Button Accessibility
**Learning:** When adding `aria-label` attributes to buttons containing icons and dynamic text (like a likes counter), a static `aria-label` will completely override the visible text for screen readers.
**Action:** Ensure the `aria-label` encompasses the dynamic data (e.g., `aria-label={`${likes} Likes`}`) and set `aria-hidden="true"` on the element containing the visible dynamic text to prevent double-reading.
