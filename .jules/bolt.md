## 2024-05-24 - ISO Date Sorting Correctness
**Learning:** While sorting by lexicographical ISO strings avoids the overhead of `new Date()`, it creates critical functional regressions in this codebase if API data uses inconsistent timezones or formats (like `2023-10-10T04:00:00-01:00` vs UTC).
**Action:** Always parse ISO strings into Date objects `new Date(dateString).getTime()` for reliable chronologial comparison. Mitigate the instantiation overhead by memoizing the sort block effectively using `useMemo` with minimal dependencies (omitting variables like `currentPage` to avoid re-sorting on simple pagination changes).

## 2025-03-09 - Avoid O(N*M) lookups inside React render mappings
**Learning:** Mapping over arrays to build UI structures while calling `.filter` on secondary arrays within the loop causes an O(N*M) bottleneck, severely delaying main thread render execution during scaling (e.g. going from 50ms to 4.5s for 5,000 items in a benchmark test).
**Action:** Always pre-group secondary data sets using `Array.prototype.reduce()` into a hash map before the mapping iteration to enable O(1) lookups. Wrap the reduction block and subsequent mapping within a `useMemo` with proper dependencies to memoize the calculation result.
