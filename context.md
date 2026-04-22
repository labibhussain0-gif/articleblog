# Project Context: BlogForge

This project is a modern news and article publishing platform, originally built with mock data and since migrated to **Sanity.io** for content management.

## 📌 Project Details
- **Name**: BlogForge
- **Focus**: High-quality journalism, technology insights, and storytelling.
- **Current Status**: All major frontend pages have been refactored to fetch dynamic content from the Sanity CMS.

## 🛠 Technical Stack
- **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Language**: TypeScript
- **Styling**: Vanilla CSS (modular and responsive)
- **CMS**: [Sanity.io](https://www.sanity.io/)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utility**: [Date-fns](https://date-fns.org/) for date formatting.

## 🎯 Objectives
1. **Sanity Integration**: Fully replace hardcoded mock data with dynamic content from Sanity.io.
2. **Dynamic Rendering**: Use `PortableText` for high-fidelity content rendering from Sanity's rich text fields.
3. **Optimized Experience**: Ensure fast loading times and optimized images via the Sanity image builder.
4. **Maintenance**: Facilitate easy content updates through the integrated Sanity Studio.

## 📂 Directory Structure

```text
.
├── src/
│   ├── components/       # Reusable UI components
│   ├── lib/
│   │   └── sanity.ts     # Sanity client and GROQ queries
│   ├── pages/
│   │   ├── HomePage.tsx  # Dynamic article grid
│   │   ├── ArticlePage.tsx # Detailed view with PortableText
│   │   ├── AuthorPage.tsx # Profile and written works
│   │    ...
│   ├── App.tsx           # Global routing and configuration
│   └── index.css         # Global styles and design system tokens
├── studio/               # Sanity Studio (Schema definitions)
│   └── schemas/          # Content models (article, author, category, tag)
├── package.json          # Dependencies and scripts
└── context.md            # This file
```

## ⚠️ Important Notes
- **Environment Variables**: Requires `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET`.
- **CORS Configuration**: The local development server (`http://localhost:3000`) must be allowed in the Sanity Management Console for successful API requests.
- **Build Process**: Run `npm run build` to verify type safety and generate the production bundle.

---
*Last Updated: 2026-03-28*
