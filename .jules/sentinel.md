## 2024-05-18 - Client-Side API Key Exposure in Vite Config
**Vulnerability:** The `GEMINI_API_KEY` was being exposed to the client-side build via Vite's `define` configuration (`process.env.GEMINI_API_KEY`).
**Learning:** Using `define` in `vite.config.ts` to pass environment variables directly statically bakes the secret into the frontend assets, exposing it to any user inspecting the client code.
**Prevention:** Never use `define` for sensitive secrets in build configurations. Any features requiring private API keys must be proxied through a secure backend server instead of being called directly from the frontend.
## 2025-02-21 - XSS Vulnerability in JSON-LD Schema Injection
**Vulnerability:** The `SchemaMarkup.tsx` component injected JSON-LD schema using `dangerouslySetInnerHTML` with a raw `JSON.stringify(schema)`. If injected fields contained `</script>` tags, an attacker could break out of the JSON context and execute arbitrary JavaScript.
**Learning:** `JSON.stringify` does not escape HTML characters, making it unsafe to inject directly into `<script>` tags when the data contains unsanitized user input.
**Prevention:** Always escape the `<` character (e.g., `.replace(/</g, '\\u003c')`) when injecting JSON strings into HTML `<script>` blocks to prevent XSS.
## 2025-02-21 - Prisma Object Injection in Authentication Routes
**Vulnerability:** The `login` and `register` endpoints in `server.ts` were reading `email`, `username`, `password`, and `name` from `req.body` and passing them directly into `prisma.user.findUnique` and `prisma.user.findFirst` queries without verifying they were strings.
**Learning:** If an attacker sends a JSON payload with an object instead of a string (e.g., `{"email": {"not": "admin@example.com"}}`), they can manipulate the database query. This can lead to unauthorized access, bypassing authentication, or extracting data.
**Prevention:** Always explicitly validate that user inputs coming from request bodies or queries are of the expected primitive types (like `string`) before using them in database queries, especially ORMs like Prisma that support complex nested query objects.
