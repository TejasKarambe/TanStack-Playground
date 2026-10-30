# API Contracts Specification — TanStack Playground

## 1. Global API Standards & Conventions

- **Base URL**: `/api/v1`
- **Protocol**: HTTPS
- **Content-Type**: `application/json; charset=UTF-8`
- **Standard Terminology**:
  - **Track**: TanStack library or ecosystem project.
  - **Lesson**: Discrete learning topic within a track.
  - **Example**: Executable multi-file code demonstration.
- **Identifier Format**: All resource identifiers are represented as 64-bit integers (`Long` in Java, `number` in TypeScript/JSON).
- **Date/Time Standard**: ISO 8601 UTC string (`YYYY-MM-DDTHH:mm:ss.sssZ`).

### 1.1 Authentication & Cookie Policy
Authentication is strictly cookie-based using `HttpOnly; Secure` cookies.
- **Never store tokens in `localStorage` or `sessionStorage`**.
- Frontend clients must send `credentials: 'include'` (Fetch) or `withCredentials: true` (Axios).
- Mutating endpoints (`POST`, `PUT`, `DELETE`) require the security header:
  ```http
  X-Requested-With: XMLHttpRequest
  ```

### 1.2 Rate Limiting Policies
- **Authentication Endpoints** (`/api/v1/auth/**`): 5 requests per minute per IP.
- **Snippet Creation & Progress Updates**: 30 requests per minute per authenticated user.
- **Read Endpoints** (`GET`): 120 requests per minute per IP.
- Rate limit headers returned on all responses:
  ```http
  X-RateLimit-Limit: 60
  X-RateLimit-Remaining: 58
  X-RateLimit-Reset: 1730282400
  ```

### 1.3 Payload & Size Limits (JSON Request Enforcement)
- **JSON Body Size Enforcement**:
  - Enforced via Tomcat container configuration: `server.tomcat.max-http-form-post-size: 524288` (512 KB) and `server.tomcat.max-swallow-size: 524288`.
  - Jackson parser constraint: `StreamReadConstraints.builder().maxStringLength(524288)`.
- **Virtual File Tree Invariants**:
  - Maximum **500 KB** total JSON size.
  - Maximum **25 files** per virtual file system tree.
  - **Hardened File Path Regex**: `^/(?!.*\.\.)(?!.*//)[a-zA-Z0-9_\-\.]+(/[a-zA-Z0-9_\-\.]+)*$`
  - *Rejection Rules*: Immediately rejects path traversal segments (`..`), double slashes (`//`), whitespace, and non-leading slash paths.

### 1.4 Uniform Pagination Envelope
All paginated collection endpoints use the standard Spring Data `Page<T>` JSON envelope:
```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 42,
  "totalPages": 3,
  "first": true,
  "last": false
}
```
*Query Parameters*: `page` (default 0), `size` (default 20, max 100), `sort` (e.g. `createdAt,desc`).
*Static Catalog Endpoints*: Fixed small catalogs (e.g. `GET /api/v1/tracks`) return an unpaginated list `[ ... ]` as documented.

### 1.5 Standard Error Response (RFC 7807 Pattern)
```json
{
  "timestamp": "2026-10-30T06:30:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/v1/progress/query-basics",
  "validationErrors": [
    {
      "field": "savedFiles",
      "rejectedValue": "[524288 bytes]",
      "message": "Saved files payload exceeds maximum limit of 500 KB"
    }
  ]
}
```

---

## 2. Authentication Endpoints (`/api/v1/auth`)

### 2.1 Register New User
- **Method**: `POST`
- **Path**: `/api/v1/auth/register`
- **Auth Required**: No (Public)
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Request Body**:
```json
{
  "email": "developer@example.com",
  "password": "SecurePassword123!",
  "displayName": "Ada Lovelace"
}
```
- **Response `201 Created`**:
  - **Headers**:
    ```http
    Set-Cookie: jwt_access=<access_jwt>; Path=/api/v1; HttpOnly; Secure; SameSite=None; Max-Age=900
    Set-Cookie: jwt_refresh=<refresh_uuid>; Path=/api/v1/auth; HttpOnly; Secure; SameSite=None; Max-Age=604800
    ```
  - **Body**:
```json
{
  "id": 1,
  "email": "developer@example.com",
  "displayName": "Ada Lovelace",
  "role": "ROLE_USER",
  "avatarUrl": null,
  "createdAt": "2026-10-30T06:30:00.000Z"
}
```

### 2.2 Login User
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Auth Required**: No (Public)
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Request Body**:
```json
{
  "email": "developer@example.com",
  "password": "SecurePassword123!"
}
```
- **Response `200 OK`**:
  - **Headers**: Same `Set-Cookie` directives as 2.1.
  - **Body**:
```json
{
  "id": 1,
  "email": "developer@example.com",
  "displayName": "Ada Lovelace",
  "role": "ROLE_USER",
  "avatarUrl": null,
  "createdAt": "2026-10-30T06:30:00.000Z"
}
```

### 2.3 Refresh Session Tokens
- **Method**: `POST`
- **Path**: `/api/v1/auth/refresh`
- **Auth Required**: Yes (via `jwt_refresh` cookie)
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `200 OK`**:
  - **Headers**: Rotated new `Set-Cookie` headers for both `jwt_access` and `jwt_refresh`.
  - **Body**:
```json
{
  "status": "SUCCESS",
  "message": "Tokens successfully rotated"
}
```

### 2.4 Logout & Revoke Session
- **Method**: `POST`
- **Path**: `/api/v1/auth/logout`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `200 OK`**:
  - **Headers**:
    ```http
    Set-Cookie: jwt_access=; Path=/api/v1; HttpOnly; Secure; SameSite=None; Max-Age=0
    Set-Cookie: jwt_refresh=; Path=/api/v1/auth; HttpOnly; Secure; SameSite=None; Max-Age=0
    ```
  - **Body**:
```json
{
  "status": "SUCCESS",
  "message": "User successfully logged out and refresh token revoked"
}
```

### 2.5 Get Current Authenticated User (`/me`)
- **Method**: `GET`
- **Path**: `/api/v1/auth/me`
- **Auth Required**: Yes (via `jwt_access` cookie)
- **Response `200 OK`**:
```json
{
  "id": 1,
  "email": "developer@example.com",
  "displayName": "Ada Lovelace",
  "role": "ROLE_USER",
  "avatarUrl": null,
  "createdAt": "2026-10-30T06:30:00.000Z"
}
```

---

## 3. User Preferences (`/api/v1/users/preferences`)

### 3.1 Get Preferences
- **Method**: `GET`
- **Path**: `/api/v1/users/preferences`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "theme": "dark",
  "editorFontSize": 14,
  "keybindings": "vscode",
  "tabSize": 2,
  "autoRun": true,
  "layoutPanes": {
    "leftWidth": 30,
    "centerWidth": 40,
    "rightWidth": 30
  }
}
```

### 3.2 Update Preferences
- **Method**: `PUT`
- **Path**: `/api/v1/users/preferences`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Request Body**:
```json
{
  "theme": "system",
  "editorFontSize": 16,
  "keybindings": "vim",
  "tabSize": 2,
  "autoRun": true,
  "layoutPanes": {
    "leftWidth": 25,
    "centerWidth": 45,
    "rightWidth": 30
  }
}
```
- **Response `200 OK`**: Echoes updated preference object.

---

## 4. Bookmarks Endpoints (`/api/v1/bookmarks`)

### 4.1 List User Bookmarks (Paginated)
- **Method**: `GET`
- **Path**: `/api/v1/bookmarks?page=0&size=20`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "content": [
    {
      "id": 12,
      "trackSlug": "query",
      "lessonSlug": "query-basics",
      "createdAt": "2026-10-29T10:15:00.000Z"
    },
    {
      "id": 15,
      "trackSlug": "table",
      "lessonSlug": "table-sorting",
      "createdAt": "2026-10-30T04:20:00.000Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 2,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### 4.2 Add Bookmark
- **Method**: `POST`
- **Path**: `/api/v1/bookmarks/{lessonSlug}`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `201 Created`**:
```json
{
  "id": 16,
  "trackSlug": "router",
  "lessonSlug": "router-basics",
  "createdAt": "2026-10-30T06:35:00.000Z"
}
```

### 4.3 Remove Bookmark
- **Method**: `DELETE`
- **Path**: `/api/v1/bookmarks/{lessonSlug}`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `204 No Content`**

---

## 5. Tracks & Curriculum Metadata (`/api/v1/tracks`)

### 5.1 List All Active Tracks (Static Catalog)
- **Method**: `GET`
- **Path**: `/api/v1/tracks`
- **Auth Required**: No (Public)
- **Response `200 OK`**:
```json
[
  {
    "id": 1,
    "slug": "query",
    "displayOrder": 1,
    "isActive": true
  },
  {
    "id": 2,
    "slug": "router",
    "displayOrder": 2,
    "isActive": true
  },
  {
    "id": 3,
    "slug": "table",
    "displayOrder": 3,
    "isActive": true
  }
]
```

### 5.2 Get Track with Lessons
- **Method**: `GET`
- **Path**: `/api/v1/tracks/{trackSlug}`
- **Auth Required**: No (Public)
- **Response `200 OK`**:
```json
{
  "id": 1,
  "slug": "query",
  "displayOrder": 1,
  "isActive": true,
  "lessons": [
    {
      "id": 101,
      "slug": "query-basics",
      "displayOrder": 1,
      "isActive": true
    },
    {
      "id": 102,
      "slug": "query-mutations",
      "displayOrder": 2,
      "isActive": true
    }
  ]
}
```

### 5.3 Get Track Lesson Referential Details
- **Method**: `GET`
- **Path**: `/api/v1/tracks/{trackSlug}/lessons/{lessonSlug}`
- **Auth Required**: No (Public)
- **Response `200 OK`**:
```json
{
  "id": 101,
  "trackId": 1,
  "trackSlug": "query",
  "slug": "query-basics",
  "displayOrder": 1,
  "isActive": true
}
```

---

## 6. User Progress & Saved Code (`/api/v1/progress`)

### 6.1 Get User Progress (Paginated)
- **Method**: `GET`
- **Path**: `/api/v1/progress?page=0&size=20`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "content": [
    {
      "lessonSlug": "query-basics",
      "trackSlug": "query",
      "status": "COMPLETED",
      "hasSavedCode": true,
      "completedAt": "2026-10-29T11:00:00.000Z",
      "updatedAt": "2026-10-29T11:00:00.000Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### 6.2 Get Single Lesson Progress & Saved Code
- **Method**: `GET`
- **Path**: `/api/v1/progress/{lessonSlug}`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "lessonSlug": "query-basics",
  "status": "COMPLETED",
  "completedAt": "2026-10-29T11:00:00.000Z",
  "savedFiles": {
    "/App.tsx": {
      "code": "import React from 'react';\n// User modified code...",
      "active": true
    }
  }
}
```

### 6.3 Update Progress & Save Custom Code
- **Method**: `PUT`
- **Path**: `/api/v1/progress/{lessonSlug}`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Validation**: Enforces hardened path regex, body < 512 KB, max 25 files.
- **Request Body**:
```json
{
  "status": "COMPLETED",
  "savedFiles": {
    "/App.tsx": {
      "code": "import React from 'react';\nexport default function App() { return <div>Solved!</div>; }",
      "active": true
    }
  }
}
```
- **Response `200 OK`**:
```json
{
  "lessonSlug": "query-basics",
  "status": "COMPLETED",
  "completedAt": "2026-10-30T06:40:00.000Z",
  "updatedAt": "2026-10-30T06:40:00.000Z"
}
```

### 6.4 Reset Custom Lesson Code to Default
- **Method**: `POST`
- **Path**: `/api/v1/progress/{lessonSlug}/reset`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `200 OK`**:
```json
{
  "lessonSlug": "query-basics",
  "status": "IN_PROGRESS",
  "message": "Custom user code cleared. Reverted to default lesson files."
}
```

---

## 7. Code Snippets & Custom Playgrounds (`/api/v1/snippets`)

### 7.1 Create Snippet
- **Method**: `POST`
- **Path**: `/api/v1/snippets`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Validation**: Body < 512 KB, max 25 files.
- **Request Body**:
```json
{
  "title": "TanStack Table with Virtual Rows",
  "description": "Custom experiment rendering 50,000 table rows seamlessly.",
  "isPublic": true,
  "files": {
    "/App.tsx": {
      "code": "import React from 'react';\nexport default function App() { return <div>Test</div>; }"
    }
  }
}
```
- **Response `201 Created`**:
```json
{
  "id": 501,
  "slug": "tnsk-8k2p1m",
  "title": "TanStack Table with Virtual Rows",
  "description": "Custom experiment rendering 50,000 table rows seamlessly.",
  "isPublic": true,
  "viewsCount": 0,
  "forksCount": 0,
  "author": {
    "id": 1,
    "displayName": "Ada Lovelace"
  },
  "createdAt": "2026-10-30T06:45:00.000Z"
}
```

### 7.2 Get Public Snippet by Slug
- **Method**: `GET`
- **Path**: `/api/v1/snippets/{slug}`
- **Auth Required**: No (Public)
- **Response `200 OK`**:
```json
{
  "id": 501,
  "slug": "tnsk-8k2p1m",
  "title": "TanStack Table with Virtual Rows",
  "description": "Custom experiment rendering 50,000 table rows seamlessly.",
  "isPublic": true,
  "viewsCount": 15,
  "forksCount": 2,
  "author": {
    "id": 1,
    "displayName": "Ada Lovelace"
  },
  "files": {
    "/App.tsx": {
      "code": "import React from 'react';\nexport default function App() { return <div>Test</div>; }"
    }
  },
  "createdAt": "2026-10-30T06:45:00.000Z",
  "updatedAt": "2026-10-30T06:45:00.000Z"
}
```

### 7.3 List My Snippets (Paginated)
- **Method**: `GET`
- **Path**: `/api/v1/snippets/my?page=0&size=10&sort=createdAt,desc`
- **Auth Required**: Yes
- **Response `200 OK`**:
```json
{
  "content": [
    {
      "id": 501,
      "slug": "tnsk-8k2p1m",
      "title": "TanStack Table with Virtual Rows",
      "description": "Custom experiment rendering 50,000 table rows seamlessly.",
      "isPublic": true,
      "viewsCount": 15,
      "forksCount": 2,
      "createdAt": "2026-10-30T06:45:00.000Z"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 1,
  "totalPages": 1,
  "first": true,
  "last": true
}
```

### 7.4 Update Snippet (Author Only)
- **Method**: `PUT`
- **Path**: `/api/v1/snippets/{slug}`
- **Auth Required**: Yes (Ownership strictly enforced; non-authors receive `403 Forbidden`)
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Request Body**:
```json
{
  "title": "TanStack Table with Virtual Rows (Updated)",
  "description": "Added dynamic row measurement support.",
  "isPublic": true,
  "files": {
    "/App.tsx": {
      "code": "import React from 'react';\nexport default function App() { return <div>Updated Test</div>; }"
    }
  }
}
```
- **Response `200 OK`**: Returns updated snippet details.

### 7.5 Delete Snippet (Author Only)
- **Method**: `DELETE`
- **Path**: `/api/v1/snippets/{slug}`
- **Auth Required**: Yes (Ownership verified)
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `204 No Content`**

### 7.6 Fork Snippet
- **Method**: `POST`
- **Path**: `/api/v1/snippets/{slug}/fork`
- **Auth Required**: Yes
- **Headers**: `X-Requested-With: XMLHttpRequest`
- **Response `201 Created`**:
```json
{
  "id": 502,
  "slug": "tnsk-9x4m7q",
  "title": "Fork of TanStack Table with Virtual Rows",
  "description": "Forked from snippet tnsk-8k2p1m",
  "isPublic": true,
  "viewsCount": 0,
  "forksCount": 0,
  "forkedFromId": 501,
  "author": {
    "id": 2,
    "displayName": "Grace Hopper"
  },
  "createdAt": "2026-10-30T06:50:00.000Z"
}
```

---

## 8. System Health Endpoint

### 8.1 Health Status
- **Method**: `GET`
- **Path**: `/actuator/health`
- **Auth Required**: No (Public)
- **Response `200 OK`**:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```
