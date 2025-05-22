# Buda API Integration

A Node.js application that integrates with the Buda.com API to fetch and analyze cryptocurrency market data, with a focus on spread calculations and market monitoring.

## Features

- Real-time cryptocurrency market data fetching
- Spread calculation for different markets
- Historical spread comparison
- Market monitoring and alerts
- RESTful API endpoints
- Swagger documentation
- Comprehensive test coverage
- Docker Compose setup with PostgreSQL database

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Jest for testing
- Pino for logging
- Swagger for API documentation
- Docker & Docker Compose
- PostgreSQL
- Prisma

## Prerequisites

- Node.js (v14 or higher)
- npm, yarn or pnpm
- Access to Buda.com API
- Docker and Docker Compose

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd buda-t1
```

2. Create a `.env` file in the root directory, follow the example file.

## Running the Application

### Using Docker Compose (Recommended)

Start all services (API, Database, and Migrations):
```bash
docker-compose up
```

Start in detached mode:
```bash
docker-compose up -d
```

Stop all services:
```bash
docker-compose down
```

### Running Tests

Run tests in container:
```bash
npm run container:test
```

Run tests with coverage in container:
```bash
npm run container:test:coverage
```

The Docker Compose setup includes:
- Node.js application container
- PostgreSQL database
- Automatic database migrations
- Environment variable management
- Volume mounting for development
- Health checks for database

## API Endpoints

The API documentation is available at `/api/docs` when the server is running.

### Main Endpoints

- `GET /api/markets` - Get all available markets
- `GET /api/ticker/:market` - Get ticker information for a specific market
- `GET /api/spread/:market` - Get current spread for a market
- `GET /api/spread/:market/alert` - Compare current spread with last recorded spread
- `GET /api/spread` - Get spreads for all markets
- `POST /api/spread/:market` - Manually set a spread value for a market
  - Body: `{ value: number }`

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── domain/         # Domain models
├── interfaces/     # TypeScript interfaces
├── middlewares/    # Express middlewares
├── repositories/   # Data access layer
├── routes/         # API routes
├── services/       # Business logic
└── tests/          # Test files
```
