# TaskManager - Complete CRUD App

A full-featured task management application built with Next.js and Supabase.

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
Here is the link as well: https://www.gnu.org/licenses/agpl-3.0.txt.

**What this means:**
- ✅ You can use, modify, and distribute this code
- ⚠️ You must share your source code if you use this in any project
- ⚠️ You must use the same AGPL-3.0 license for derivative works
- ⚠️ If you run this on a server, users must have access to the source code

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure
Create the following folder structure:
src/
├── app/
│   ├── auth/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   ├── auth/
│   │   └── auth-form.tsx
│   ├── tasks/
│   │   ├── task-form.tsx
│   │   ├── task-item.tsx
│   │   └── task-list.tsx
│   └── navigation.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── types.ts
│   └── utils.ts
└── middleware.ts
