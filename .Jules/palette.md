## 2025-02-28 - [Accessible Icon and Counter Buttons]
**Learning:** [Overriding dynamic text with static `aria-label`s on buttons. When a button contains visible dynamic text (like a counter `<span>{likes}</span>`), a static `aria-label` will completely override the visible text for screen readers. They will read just the static label instead of the numbers. ]
**Action:** [Ensure the `aria-label` encompasses the dynamic data (e.g., `aria-label={`${likes} Likes`}`) when dealing with components that use icons and dynamic counters.]
