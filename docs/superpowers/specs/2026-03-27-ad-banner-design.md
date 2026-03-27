# Ad Banner Integration Design

## Context

Add Google AdSense-ready ad placeholders in strategic, non-sloppy locations across the news blog site. These are placeholder `<div>` elements with `data-ad-slot` attributes, ready to swap for real `<ins class="adsbygoogle">` tags when ads are configured.

## Component Design

### `AdBanner.tsx`

**Location:** `src/components/ads/AdBanner.tsx`

**Props:**
- `slot: string` — value for `data-ad-slot` attribute
- `format: 'horizontal' | 'rectangle' | 'article'` — controls size/layout
- `className?: string` — optional additional CSS classes

**Implementation:**
```tsx
<div className={`ad-banner ad-banner--${format} ${className || ''}`}>
  <span className="ad-banner__label">Advertisement</span>
  <div data-ad-slot={slot} />
</div>
```

**Styling (Tailwind):**
| Format | Dimensions | Appearance |
|--------|------------|------------|
| `horizontal` | `w-full h-[90px]` | Full-width, subtle gray bg, centered label |
| `rectangle` | `w-[300px] h-[250px]` | Fixed 300x250, centered |
| `article` | `max-w-xl w-full h-[120px]` | Max 336px wide, inline-friendly |

**Styling Details:**
- Subtle gray background (`bg-slate-100 dark:bg-slate-800/50`)
- Dashed border (`border-2 border-dashed border-slate-300 dark:border-slate-600`)
- Centered "Advertisement" label in small, muted text
- Rounded corners (`rounded-lg`)

## Page Integrations

### `HomePage.tsx`

| # | Location | Format | Slot |
|---|----------|--------|------|
| 1 | Between Hero section and Noteworthy Reads section | `horizontal` | `home-hero-bottom` |
| 2 | Between 2nd and 3rd category sections (Economy → Culture) | `horizontal` | `home-category-middle` |
| 3 | Newsletter sidebar, alongside newsletter form | `rectangle` | `home-sidebar-rectangle` |

### `ArticlePage.tsx`

| # | Location | Format | Slot |
|---|----------|--------|------|
| 1 | After 3rd paragraph of article body (inline flow) | `article` | `article-inline` |
| 2 | Between article actions and "Related Articles" section | `horizontal` | `article-bottom` |

**Implementation Note for ArticlePage:**
Paragraphs are split by `\n\n` and rendered in a map. The ad after paragraph 3 uses the index:
```tsx
{mockArticle.content.split('\n\n').map((paragraph, index) => {
  // ... render paragraph
  if (index === 2) {
    return (<><p>...</p><AdBanner slot="article-inline" format="article" className="my-8" /></>);
  }
})}
```

## Files to Create/Modify

- **CREATE:** `src/components/ads/AdBanner.tsx`
- **MODIFY:** `src/pages/HomePage.tsx` — insert 3 `<AdBanner>` components
- **MODIFY:** `src/pages/ArticlePage.tsx` — insert 2 `<AdBanner>` components

## Verification

1. Build succeeds: `npm run build`
2. Components render with correct slot attributes
3. Styling matches design (visible dashed border, label, proper sizing)
4. No layout shifts or overflow issues on any viewport
