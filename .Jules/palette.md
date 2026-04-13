## 2024-05-17 - Icon-only Buttons ARIA Labels
**Learning:** Found several icon-only buttons (search clear, pagination) lacking `aria-label` attributes across different pages (`SearchPage.tsx`, `CategoryPage.tsx`). This is a common pattern when using libraries like `lucide-react` directly inside buttons without accompanying text.
**Action:** Ensure that anytime an icon component is the sole child of a button, an `aria-label` is explicitly provided describing the action.
