## 2024-04-09 - Missing Labels and Loading States on Custom Forms
**Learning:** Manually constructed forms in this codebase (like the newsletter signup in the Footer) frequently lack proper ARIA labels for inputs without direct `<label>` tags and omit loading states during async actions.
**Action:** When auditing or adding forms without libraries, explicitly check for and add `aria-label`s and implement disabled/loading states for robust UX and accessibility.
