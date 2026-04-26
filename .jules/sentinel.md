## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.

## 2024-05-20 - Prisma NoSQL Object Injection Vulnerability
**Vulnerability:** Authentication routes (`/api/v1/auth/login` and `/api/v1/auth/register`) accepted JSON requests without verifying that the `email`, `username`, and `password` fields were strings. This allowed an attacker to pass objects (like `{ "startsWith": "" }`) to Prisma queries, bypassing authentication checks and retrieving or modifying database records without knowing the exact strings.
**Learning:** Prisma queries in Express routes are vulnerable to object injection if user input from `req.body` is not strictly type-checked, because Express `express.json()` parses input into objects, and Prisma accepts objects as operators.
**Prevention:** Always validate that user inputs used in Prisma queries are explicitly of type 'string' before execution to prevent NoSQL injection.
