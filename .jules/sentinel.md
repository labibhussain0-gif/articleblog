## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.
## 2025-02-14 - Fix Prisma object injection vulnerability
**Vulnerability:** The `/api/v1/auth/register` and `/api/v1/auth/login` routes passed properties extracted from `req.body` directly to Prisma `findFirst` and `findUnique` queries without explicit type validation. Since Express uses `express.json()`, an attacker could pass a JSON object (like `{"email": {"startsWith": "a"}}`) which could result in NoSQL/object injection in Prisma.
**Learning:** Type-checking input properties is critical before using them in database queries, particularly when handling parsed JSON payloads with an ORM like Prisma. The implicit assumption that JSON properties mapped to strings must be validated.
**Prevention:** Always strictly validate `req.body` payload structures and enforce strict primitive typing (e.g., `typeof ... === 'string'`) before feeding external inputs to Prisma queries.
