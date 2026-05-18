# Smart Leads Dashboard

A professional MERN TypeScript lead management dashboard built for the ServiceHive full-stack internship assignment.

The frontend uses Next.js with React, TypeScript, and TailwindCSS. The backend uses Node.js, Express, TypeScript, MongoDB, and Mongoose.

## Features

- JWT authentication with bcrypt password hashing
- User registration, login, and protected routes
- Role-based access control for `admin` and `sales`
- Lead CRUD with status and source enums
- Combined status/source/search filters
- Debounced search by name or email
- Latest/oldest sorting
- Backend pagination with 10 records per page
- CSV export respecting active filters and RBAC
- Responsive dashboard UI
- Loading, empty, and error states
- Form validation on client and server
- Centralized API error handling
- Docker setup
- Dark mode support

## Architecture

```txt
client/  Next.js React app
server/  Express API
docs/    API documentation
```

Backend layering:

- Controllers handle HTTP requests and responses.
- Services own business rules.
- Repositories isolate Mongoose queries.
- Middleware handles auth, validation, RBAC, and errors.

Frontend layering:

- `src/app` contains Next.js routes.
- `src/features` contains auth and lead domain logic.
- `src/components` contains reusable UI.
- `src/lib/api.ts` contains the typed API client.

## Tech Stack

Frontend:

- Next.js
- React
- TypeScript
- TailwindCSS

Backend:

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

## Local Setup

Install dependencies:

```bash
npm run install:all
```

Create environment files:

```bash
cp .env.example server/.env
cp .env.example client/.env.local
```

For `server/.env`, keep the server variables. For `client/.env.local`, keep:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

For local MongoDB, use:

```env
MONGODB_URI=mongodb://localhost:27017/smart-leads-dashboard
```

Run MongoDB locally, then start the apps:

```bash
npm run dev:server
npm run dev:client
```

The API runs on `http://localhost:5000`.

The dashboard runs on `http://localhost:3000`.

Quick local URLs:

```txt
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
```

## Docker Setup

Run the full stack:

```bash
docker compose up --build
```

Services:

- Client: `http://localhost:3000`
- Server: `http://localhost:5000/api`
- MongoDB: `localhost:27017`

Docker uses the internal MongoDB service host:

```env
MONGODB_URI=mongodb://mongo:27017/smart-leads-dashboard
```

## Demo Roles

The assignment requires RBAC. You can register one account as `admin` and another as `sales`, or seed ready-made demo users and leads.

- Admin can view and manage all leads.
- Sales users can view and manage only leads they created.

Admin registration is intentionally available in the UI for assignment/demo review. In a production system, admin creation should be restricted to an invite or internal provisioning flow.

## Demo Data

Seed demo accounts and 24 realistic leads:

```bash
npm run seed
```

The seed script is safe to run repeatedly. It upserts the demo users and replaces only the known demo leads.

Demo credentials:

```txt
Admin: admin@example.com / password123
Sales: sales@example.com / password123
```

Suggested demo workflow:

- Login as admin and confirm 24 leads are visible with pagination.
- Search for `Rahul`.
- Filter by `Qualified` status and `Instagram` source together.
- Switch latest/oldest sorting.
- Export CSV with active filters.
- Create, edit, view, and delete a lead.
- Login as sales user and confirm fewer leads are visible because sales users only see their own leads.

## API Documentation

See [docs/API.md](docs/API.md).

## Deployment Notes

Recommended deployment:

- MongoDB Atlas for the database
- Render Web Service for `server`
- Render Web Service for `client`

Server environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=<deployed-client-url>
```

Client environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=<deployed-server-url>/api
```

After deployment, run the seed command against the hosted database by setting the production `MONGODB_URI` in the server environment before running `npm run seed --prefix server`.

## Live Submission Links

- GitHub Repository: `<add-github-repository-url>`
- Frontend Live App: `<add-frontend-live-url>`
- Backend Live API: `<add-backend-live-api-url>`
- Loom Demo: `<add-loom-recording-url>`

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

## Submission Checklist

- GitHub repository URL
- Hosted frontend link
- Hosted backend API link
- 2-minute Loom or screen recording
- Updated resume
- README
- `.env.example`
- API documentation
- Setup instructions
- Deployment link, preferred

Submission email:

```txt
ritik.yadav@servicehive.tech
```

Subject:

```txt
MERN Internship Assignment Submission - Your Name
```
