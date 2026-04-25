## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.
## 2025-02-21 - [Prevent Prisma Object Injection]
**Vulnerability:** Found Prisma object/NoSQL injection vulnerability in `/api/v1/auth/register` and `/api/v1/auth/login` where `req.body` parameters (`email`, `username`, `password`, `name`) were passed directly into `prisma.user.findFirst` and `prisma.user.findUnique` without any explicit type validation.
**Learning:** If a user submits an object (e.g. `{"email": {"contains": ""}}`) instead of a string, Prisma can interpret this object as a query condition, which can bypass authentication checks or lead to unintended data disclosure.
**Prevention:** Always validate that inputs derived from `req.body` and used in database queries are strictly strings (e.g., `typeof email === 'string'`) before passing them to Prisma methods.
