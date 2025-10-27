# Multi-User Blog Platform

A modern, full-stack blog platform built with Next.js 14, featuring multi-user support, category management, image uploads, and a professional interface with light/dark mode support.

## 🚀 Features

- **Multi-user blog system** with user authentication
- **Category management** with filtering capabilities
- **Trending blogs** section
- **Rich text editor** for blog creation
- **Image uploads** via UploadThing
- **Light/Dark mode** with system preference detection
- **Responsive design** with Tailwind CSS
- **Type-safe API** with tRPC
- **PostgreSQL database** with Drizzle ORM

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **API Layer:** tRPC v11
- **Styling:** Tailwind CSS
- **File Uploads:** UploadThing
- **Validation:** Zod
- **Deployment:** Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/AtharvShelke/blog-app.git
cd blog-ap

text

### 2. Install Dependencies

npm install

or
yarn install

or
pnpm install

or
bun install

text

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add all the environment variables listed above.

### 4. Set Up the Database

Generate Drizzle schema migrations
npm run db:generate

Push the schema to your PostgreSQL database
npm run db:push

(Optional) Open Drizzle Studio to view/manage your database
npm run db:studio

text

### 5. Seed the Database (Optional)

To populate your database with sample data:

**Option 1: Using Drizzle Studio**
1. Run `npm run db:studio`
2. Navigate to `http://localhost:4983`
3. Manually add sample blogs, categories, and users through the UI

**Option 2: Custom Seed Script**
If you have a `seed.ts` file in your project:

npm run db:seed

text

**Manual Seeding Steps:**
1. Create user accounts through your application
2. Add 3-5 categories (e.g., Technology, Lifestyle, Business, Travel)
3. Create sample blog posts with different authors and categories
4. Test trending functionality by creating posts with varying view counts

### 6. Run the Development Server

npm run dev

or
yarn dev

or
pnpm dev

or
bun dev

text

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Available Scripts

Development
npm run dev # Start development server on localhost:3000
npm run build # Build production bundle
npm run start # Start production server
npm run lint # Run ESLint for code quality
Database Management
npm run db:generate # Generate Drizzle migrations from schema
npm run db:push # Push schema changes to database
npm run db:studio # Open Drizzle Studio (GUI for database)
npm run db:seed # Seed database with sample data (if configured)

## 👤 Author

**Atharv Shelke**

- GitHub: [@AtharvShelke](https://github.com/AtharvShelke)

## 🔗 Links

- **Live Demo:** [https://blog-app-theta-roan.vercel.app/](https://blog-app-theta-roan.vercel.app/)
- **Repository:** [https://github.com/AtharvShelke/blog-app.git](https://github.com/AtharvShelke/blog-app.git)

---

⭐ If you found this project helpful, please consider giving it a star!