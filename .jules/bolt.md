## 2024-05-24 - ISO Date Sorting Correctness
**Learning:** While sorting by lexicographical ISO strings avoids the overhead of `new Date()`, it creates critical functional regressions in this codebase if API data uses inconsistent timezones or formats (like `2023-10-10T04:00:00-01:00` vs UTC).
**Action:** Always parse ISO strings into Date objects `new Date(dateString).getTime()` for reliable chronologial comparison. Mitigate the instantiation overhead by memoizing the sort block effectively using `useMemo` with minimal dependencies (omitting variables like `currentPage` to avoid re-sorting on simple pagination changes).

## 2024-05-15 - Array Filtering in Render Loops
**Learning:** Filtering a large array (like `articles`) inside a `.map` loop over another array (like `categories`) causes O(N*M) complexity, leading to severe main-thread blocking during rendering.
**Action:** Always pre-group data into a hash map using `Array.prototype.reduce()` to achieve O(N) complexity, and wrap the calculation in `useMemo` to prevent unnecessary execution on re-renders.
