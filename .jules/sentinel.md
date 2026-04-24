## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.
## 2024-05-24 - [Fix Prisma Object Injection]
**Vulnerability:** Prisma object/NoSQL injection vulnerability via unsanitized `req.body` inputs in `/api/v1/auth/register` and `/api/v1/auth/login` endpoints.
**Learning:** `req.body` input that is supposed to be a string can be an object if not strictly validated. If this object is passed into Prisma functions (e.g. `findFirst` or `findUnique`), attackers can inject Prisma query operators like `{ startsWith: "admin" }` to bypass authentication or enumerate users.
**Prevention:** Always validate that user inputs coming from requests (`req.body`, `req.query`, etc.) are explicitly of type 'string' (e.g. `typeof input === 'string'`) before passing them to Prisma queries.
