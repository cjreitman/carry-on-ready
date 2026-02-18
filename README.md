# CarryOn Ready

A carry-on-only travel packing optimization tool. Generates context-aware checklists constrained by bag capacity.

## Setup

### Prerequisites

- Node.js >= 18
- MongoDB running locally (or a remote URI)
- Stripe account (test mode) with a one-time $9 price object

### Install

```bash
npm run install:all
```

### Configure environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit both `.env` files with your values:

**server/.env**
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 4001) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Random string for signing tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_...) |
| `STRIPE_PRICE_ID` | Stripe Price ID for the $9 Pro product |
| `CLIENT_URL` | Client origin for CORS (default: http://localhost:5173) |

**client/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | API base URL (default: http://localhost:4001) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (pk_test_...) |

### Run (development)

```bash
npm run dev
```

Starts both server (:4001) and client (:5173) with hot reload. The Vite dev server proxies `/api` requests to the Express server.

### Verify

- Client: http://localhost:5173
- Health check: http://localhost:5173/api/health → `{ "status": "ok" }`
