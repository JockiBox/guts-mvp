# Next.js Project Instructions

## Tech Stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- <!-- Add: Supabase/Neon/Prisma for DB -->

## Coding Standards

- Use Server Components by default
- Client Components only when needed ('use client')
- Use Server Actions for mutations
- Colocate components with routes when possible
- Use Tailwind for styling (no CSS modules)

## File Structure

```
app/
  (auth)/           # Auth-related routes
  (dashboard)/      # Dashboard routes
  api/              # API routes (use sparingly)
  layout.tsx        # Root layout
  page.tsx          # Home page
components/
  ui/               # Reusable UI components
  forms/            # Form components
lib/
  actions/          # Server Actions
  db/               # Database utilities
  utils.ts          # Helper functions
```

## Important Patterns

- Use `loading.tsx` for suspense boundaries
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages
- Validate with Zod on server actions
- Use `revalidatePath` / `revalidateTag` for cache invalidation

## Environment Variables

- `NEXT_PUBLIC_*` for client-side vars
- All others server-only

## Deployment

- Vercel (auto-deploy on push to main)
- Preview deployments on PRs
