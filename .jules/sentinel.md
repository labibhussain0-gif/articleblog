## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.
## 2026-04-27 - Prisma Object/NoSQL Injection in Auth Routes
**Vulnerability:** The `/api/v1/auth/login` and `/api/v1/auth/register` endpoints used user input from `req.body` directly in Prisma query conditions (`findFirst` and `findUnique`) without validating that the inputs were strings. By sending an object like `{"email": {"contains": "admin"}}` instead of a string, an attacker could bypass authentication checks.
**Learning:** Prisma queries are vulnerable to object injection (similar to NoSQL injection in MongoDB) if user input is passed directly to the `where` clause without type validation. Express's `express.json()` middleware parses inputs as JSON objects, allowing attackers to supply complex objects containing Prisma operators.
**Prevention:** Explicitly validate that user inputs used in Prisma queries are of type 'string' (e.g., `typeof req.body.email === 'string'`) before execution to prevent malicious query objects from being evaluated.
