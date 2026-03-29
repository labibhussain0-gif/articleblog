## 2024-05-19 - Added ARIA labels to article interactive buttons
**Learning:** Icon-only buttons (like social sharing, heart/likes, bookmarks) often lack `aria-label`s, which makes them inaccessible for screen readers. Using dynamic values in `aria-label` (e.g., \`Like article (${likes} likes)\`) provides a unified, clear description rather than disjointed numbers and icons.
**Action:** Always verify that interactive elements, especially those relying on icons, have descriptive `aria-label` attributes.
