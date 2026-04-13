## 2024-04-07 - Missing aria-labels on icon-only buttons
**Learning:** Icon-only buttons (like Bookmark, Share, Pagination, Clear Search) frequently lack `aria-label` attributes, making them inaccessible to screen readers. Relying purely on visual icons creates a significant barrier.
**Action:** Always verify and add explicit `aria-label` attributes to any button that does not contain descriptive text content.
