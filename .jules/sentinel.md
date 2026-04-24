## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.
## 2025-02-23 - Prisma Object Injection Vulnerability in Express Routes
**Vulnerability:** The `/api/v1/auth/register` and `/api/v1/auth/login` endpoints extracted `email`, `username`, `password`, and `name` from `req.body` and passed them directly to Prisma queries (`findFirst` and `findUnique`) without validation. An attacker could bypass authentication or cause unexpected database behavior by passing objects (e.g., `{"email": {"contains": "admin"}}`) instead of strings.
**Learning:** `req.body` parsing via `express.json()` can return any valid JSON structure, not just primitive strings. Passing these untyped objects directly into Prisma queries exposes the application to Object/NoSQL Injection attacks.
**Prevention:** Always explicitly validate that user inputs extracted from `req.body` and intended for Prisma query clauses are of type 'string' before execution.
