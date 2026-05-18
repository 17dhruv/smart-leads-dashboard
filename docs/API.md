# Smart Leads Dashboard API

Base URL: `http://localhost:5000/api`

All protected routes require:

```http
Authorization: Bearer <jwt>
```

Responses use:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Validation failed"
}
```

## Health

### `GET /health`

Returns API status.

## Authentication

### `POST /auth/register`

Registers a user and returns a JWT.

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

`role` may be `admin` or `sales`. If omitted, it defaults to `sales`.

### `POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### `GET /auth/me`

Returns the authenticated user.

## Leads

Lead statuses:

- `New`
- `Contacted`
- `Qualified`
- `Lost`

Lead sources:

- `Website`
- `Instagram`
- `Referral`

### `GET /leads`

Returns paginated leads. Limit is always `10`.

Query params:

- `status`
- `source`
- `search`
- `sort`: `latest` or `oldest`
- `page`

Example:

```http
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "665000000000000000000000",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": "664000000000000000000000",
      "createdAt": "2026-05-17T10:00:00.000Z",
      "updatedAt": "2026-05-17T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### `POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Website"
}
```

### `GET /leads/:id`

Returns a single accessible lead.

### `PATCH /leads/:id`

Accepts any subset of:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Contacted",
  "source": "Referral"
}
```

### `DELETE /leads/:id`

Deletes an accessible lead.

### `GET /leads/export/csv`

Exports accessible leads as CSV. Supports the same query params as `GET /leads`.

## RBAC

- Admin users can view and manage all leads.
- Sales users can view and manage only leads they created.
- RBAC is enforced on list, detail, update, delete, and CSV export.
