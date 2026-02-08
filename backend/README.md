# EarnPrime Backend API

A production-ready backend API server for EarnPrime built with Fastify, TypeScript, and PostgreSQL.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run database migration
npx tsx src/db/migrate.ts

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── db/              # Database connection and migrations
│   ├── middleware/      # Auth and other middleware
│   ├── repositories/    # Data access layer
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── server.ts        # Main server file
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Check server and database status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Plaid Integration
- `POST /api/plaid/create-link-token` - Create Plaid Link token
- `POST /api/plaid/exchange-token` - Exchange public token for access token
- `GET /api/plaid/accounts` - Get user's bank accounts (requires auth)
- `GET /api/plaid/balances` - Get account balances (requires auth)
- `POST /api/plaid/sync-transactions` - Sync transactions from Plaid (requires auth)
- `GET /api/plaid/transactions?limit=100` - Get transactions (requires auth)

## 🗄️ Database Schema

### Tables
- **users** - User accounts
- **plaid_items** - Connected bank institutions
- **bank_accounts** - Bank account details
- **transactions** - Transaction history

See `src/db/schema.sql` for full schema.

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login/register, include the token in requests:

```typescript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3002
NODE_ENV=development
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=postgres
DB_USER=your-db-user
DB_PASSWORD="your-password"
JWT_SECRET=your-jwt-secret
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SANDBOX_SECRET=your-plaid-secret
PLAID_ENV=sandbox
FRONTEND_URL=http://localhost:3001
```

## 🧪 Testing

The backend server is running on `http://localhost:3002`

Test the health endpoint:
```bash
curl http://localhost:3002/health
```

## 📝 Development Notes

- The server automatically reloads on file changes in dev mode
- Database migrations must be run before first startup
- CORS is configured to allow requests from the frontend URL
- All passwords are hashed using bcrypt
- Access tokens are stored encrypted in the database (production ready)

## 🔄 Next Steps

1. **Add more endpoints** as needed for your business logic
2. **Set up proper logging** with a logging service in production
3. **Add rate limiting** for API endpoints
4. **Set up webhooks** from Plaid for real-time updates
5. **Add comprehensive tests** (unit, integration, e2e)
6. **Set up CI/CD** for automated deployments
