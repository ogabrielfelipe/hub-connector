# Hub Connector API

Backend service for Hub Connector - A routing and gateway management system.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: MongoDB with Mongoose
- **Cache/Queue**: Redis, BullMQ
- **Search**: OpenSearch
- **Testing**: Vitest
- **Authentication**: JWT with CASL for permissions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- MongoDB
- Redis
- OpenSearch (optional)

### Installation

```bash
pnpm install
```

### Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

### Running the Application

**HTTP Server:**

```bash
pnpm run dev:http
```

**Worker:**

```bash
pnpm run dev:worker
```

### Docker Services

Start required services (MongoDB, Redis, OpenSearch):

```bash
docker-compose up -d
```

## Testing

**Run all tests:**

```bash
pnpm test
```

**Unit tests:**

```bash
pnpm run test:unit
```

**E2E tests:**

```bash
pnpm run test:e2e
```

**Coverage:**

```bash
pnpm run test:coverage
```

## Scripts

- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint errors
- `pnpm run format` - Format code with Prettier
- `pnpm run seed` - Seed database



## License

ISC
