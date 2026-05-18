# Smart Leads Dashboard

A full-stack MERN lead management dashboard built for the ServiceHive Full Stack Internship Assignment. The application provides secure authentication, role-based lead access, advanced filtering, backend pagination, CSV export, and a responsive dashboard experience.

## Live Links

- GitHub Repository: `https://github.com/17dhruv/smart-leads-dashboard`
- Frontend Live App: `https://smart-leads-dashboard-pink.vercel.app`
- Backend API: `https://smart-leads-dashboard-yzap.onrender.com/api`
- API Documentation: [`docs/API.md`](docs/API.md)

## Feature Overview

- JWT-based authentication with bcrypt password hashing
- User registration, login, protected routes, and session restore
- Role-based access control for `admin` and `sales`
- Lead CRUD with detail, create, edit, and delete flows
- Combined status, source, search, and sort filters
- Debounced search by lead name or email
- Backend pagination with a fixed 10-record page size
- CSV export that respects active filters and RBAC rules
- Responsive dashboard UI with reusable components
- Loading, empty, error, and form validation states
- Centralized API error handling and request validation
- Docker setup for full-stack local execution
- Dark mode support
- Demo seed script for realistic review data

## Assignment Compliance

| Assignment requirement | Status | Implementation |
| --- | --- | --- |
| React.js frontend | Done | Next.js React app in `client` |
| TypeScript frontend | Done | Strict TypeScript client code |
| TailwindCSS | Done | Responsive UI styling |
| Node.js backend | Done | Express API in `server` |
| Express.js | Done | REST API routes, controllers, middleware |
| TypeScript backend | Done | Strict TypeScript server code |
| MongoDB + Mongoose | Done | Mongoose models for users and leads |
| JWT authentication | Done | Register, login, auth middleware, `/auth/me` |
| Password hashing | Done | bcrypt hashing before persistence |
| Protected routes | Done | API auth middleware and frontend auth gates |
| Lead CRUD | Done | Create, list, detail, update, delete |
| Lead fields | Done | Name, email, status, source, created timestamps |
| Status/source filters | Done | API and dashboard filter controls |
| Search by name/email | Done | Case-insensitive backend search |
| Latest/oldest sorting | Done | Created-at sort order |
| Multiple filters together | Done | Combined MongoDB query filter |
| Backend pagination | Done | `skip`, `limit`, and response metadata |
| Limit 10 records/page | Done | Central page-size constant |
| Loading/empty/error states | Done | Reusable page state components |
| Form validation | Done | Client input validation and Zod API validation |
| REST API standards | Done | Resource routes and clean response format |
| Proper status codes | Done | Success and error status handling |
| Centralized error handling | Done | Express error middleware |
| Debounced search | Done | Debounced dashboard search input |
| CSV export | Done | Filter-aware CSV endpoint and download action |
| Role-based access control | Done | Admin can access all leads; sales users access owned leads |
| Docker setup | Done | Dockerfiles and `docker-compose.yml` |
| Dark mode bonus | Done | Theme toggle and persisted preference |
| README + setup docs | Done | This README and API docs |
| `.env.example` without secrets | Done | Placeholder-only environment template |

## Demo Access

Use these review accounts in the live app:

```txt
Admin: admin@example.com / password123
Sales: sales@example.com / password123
```

Admin users can view and manage all leads. Sales users can view and manage only the leads assigned to their own account.

## Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- TailwindCSS
- Lucide React

Backend:

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT
- bcrypt

## Project Structure

```txt
client/  Next.js frontend application
server/  Express API application
docs/    API documentation
```

Backend layering:

- Controllers handle HTTP requests and responses.
- Services contain business rules.
- Repositories isolate Mongoose queries.
- Middleware handles authentication, validation, and errors.

Frontend layering:

- `src/app` contains Next.js routes.
- `src/features` contains domain-specific auth and lead flows.
- `src/components` contains reusable UI components.
- `src/lib/api.ts` contains the typed API client.

## Environment Variables

Use `.env.example` as the template for server and client configuration. It contains only placeholder/demo-safe values; no real secrets are committed to the repository.

Required server variables:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_ORIGIN`

Required client variable:

- `NEXT_PUBLIC_API_BASE_URL`

## Setup

Install dependencies:

```bash
npm run install:all
```

Create environment files:

```bash
cp .env.example server/.env
cp .env.example client/.env.local
```

Start the backend and frontend:

```bash
npm run dev:server
npm run dev:client
```

Seed demo users and leads:

```bash
npm run seed
```

The seed script is idempotent. It upserts the demo users and replaces only known demo leads owned by those demo accounts.

## Docker

Run the full stack with Docker:

```bash
docker compose up --build
```

Docker uses the internal MongoDB service host:

```env
MONGODB_URI=mongodb://mongo:27017/smart-leads-dashboard
```

## Scripts

Root:

```bash
npm run install:all
npm run seed
npm run build
npm run typecheck
```

Server:

```bash
npm run dev --prefix server
npm run seed --prefix server
npm run build --prefix server
npm run start --prefix server
```

Client:

```bash
npm run dev --prefix client
npm run build --prefix client
npm run start --prefix client
```

## Verification

The project has been verified with:

```bash
npm run typecheck --prefix server
npm run typecheck --prefix client
npm run build
```

Manual verification includes authentication, lead CRUD, combined filters, sorting, backend pagination, CSV export, RBAC behavior, and responsive dashboard usage.
