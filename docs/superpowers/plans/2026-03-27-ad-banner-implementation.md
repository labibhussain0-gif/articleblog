# Ad Banner Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google AdSense-ready ad placeholders in strategic locations across HomePage and ArticlePage.

**Architecture:** A single reusable `AdBanner` component with format variants (horizontal, rectangle, article) that renders a styled placeholder div with `data-ad-slot` attribute. Placed into existing page layouts at natural content breaks.

**Tech Stack:** React (TSX), Tailwind CSS, existing component patterns

---

## File Structure

- **Create:** `src/components/ads/AdBanner.tsx` — reusable ad banner component
- **Modify:** `src/pages/HomePage.tsx:1` — insert 3 `<AdBanner>` components
- **Modify:** `src/pages/ArticlePage.tsx:1` — insert 2 `<AdBanner>` components

---

## Task 1: Create AdBanner Component

**Files:**
- Create: `src/components/ads/AdBanner.tsx`

- [ ] **Step 1: Create the component directory and file**

Create `src/components/ads/AdBanner.tsx` with the following content:

```tsx
import { ReactNode } from 'react';

type AdFormat = 'horizontal' | 'rectangle' | 'article';

interface AdBannerProps {
  slot: string;
  format: AdFormat;
  className?: string;
}

const formatStyles: Record<AdFormat, string> = {
  horizontal: 'w-full h-[90px] max-w-full',
  rectangle: 'w-[300px] h-[250px]',
  article: 'max-w-xl w-full h-[120px]',
};

export default function AdBanner({ slot, format, className = '' }: AdBannerProps) {
  return (
    <div
      className={`ad-banner ad-banner--${format} flex flex-col items-center justify-center ${formatStyles[format]} ${className}`}
    >
      <span className="ad-banner__label text-xs text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wide">
        Advertisement
      </span>
      <div
        data-ad-slot={slot}
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800/50 w-full h-full flex items-center justify-center"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ads/AdBanner.tsx
git commit -m "feat: add AdBanner component with format variants

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Add Ad Banners to HomePage

**Files:**
- Modify: `src/pages/HomePage.tsx:1`

**Imports to add (after existing imports):**
```tsx
import AdBanner from '../components/ads/AdBanner';
```

**Changes:**

1. **After Hero section, before Noteworthy Reads** (after line 167 `</section>`):

Insert inside the outer section wrapping Hero+Latest, after line 167:
```tsx
        {/* Ad Banner: After Hero */}
        <section className="mb-12">
          <AdBanner slot="home-hero-bottom" format="horizontal" />
        </section>
```

2. **In the Noteworthy Reads area, add rectangle to sidebar** (around line 206-217, inside the sidebar div alongside NewsletterForm):

```tsx
              <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl p-6 h-full flex flex-col justify-center">
                <Mail className="w-10 h-10 mb-4 text-slate-400" />
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Get the Daily Briefing
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  The most important stories, delivered to your inbox every morning.
                </p>
                <NewsletterForm />
                <div className="mt-6">
                  <AdBanner slot="home-sidebar-rectangle" format="rectangle" className="mx-auto" />
                </div>
              </div>
```

3. **Between category sections 2 and 3** — after the Economy section (line 82), before Culture section (line 83):

```tsx
        {/* Ad Banner: Between Category Sections */}
        <section className="mb-12">
          <AdBanner slot="home-category-middle" format="horizontal" />
        </section>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: add 3 ad banner placements to homepage

- Horizontal between hero and noteworthy reads
- Rectangle in newsletter sidebar
- Horizontal between 2nd and 3rd category sections

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Add Ad Banners to ArticlePage

**Files:**
- Modify: `src/pages/ArticlePage.tsx:1`

**Imports to add (after existing imports):**
```tsx
import AdBanner from '../components/ads/AdBanner';
```

**Changes:**

1. **After 3rd paragraph** — In the content rendering map (around line 139), after splitting by `\n\n`, insert ad after index 2:

The current map renders paragraphs. Change the logic to:
```tsx
{mockArticle.content.split('\n\n').map((paragraph, index) => {
  if (paragraph.startsWith('## ')) {
    return <h2 key={index} className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{paragraph.replace('## ', '')}</h2>;
  }
  if (paragraph.startsWith('> ')) {
    return <blockquote key={index} className="border-l-4 border-red-600 pl-6 py-2 my-6 italic text-slate-700 dark:text-slate-300">{paragraph.replace('> ', '')}</blockquote>;
  }
  if (paragraph.startsWith('- ')) {
    const items = paragraph.split('\n').filter(line => line.startsWith('- '));
    return (
      <ul key={index} className="list-disc list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">
        {items.map((item, i) => <li key={i}>{item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>)}
      </ul>
    );
  }
  return (
    <>
      <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{paragraph}</p>
      {index === 2 && <AdBanner slot="article-inline" format="article" className="my-8" />}
    </>
  );
})}
```

2. **Between actions and Related Articles** — after the Actions div (line 185 `</div>`), before Related Articles section (line 188 `<section`):

```tsx
        {/* Ad Banner: Before Related Articles */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24">
          <AdBanner slot="article-bottom" format="horizontal" className="my-8" />
        </div>
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/ArticlePage.tsx
git commit -m "feat: add 2 ad banner placements to article page

- Article format after 3rd paragraph inline
- Horizontal between actions and related articles

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Verification

- [ ] Run `npm run build` — should succeed with no errors
- [ ] Verify all 5 ad placements render correctly:
  - HomePage: 1 hero, 1 sidebar rectangle, 1 between categories
  - ArticlePage: 1 inline article, 1 bottom horizontal
- [ ] Check dark mode styling on both pages
- [ ] Verify no layout overflow or shifts

---

## Summary of Commits

1. `feat: add AdBanner component with format variants`
2. `feat: add 3 ad banner placements to homepage`
3. `feat: add 2 ad banner placements to article page`
