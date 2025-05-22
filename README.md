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
- AWS ECS deployment ready

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
- AWS ECS, ALB, Route 53

## Prerequisites

- Node.js (v14 or higher)
- npm, yarn or pnpm
- Access to Buda.com API
- Docker and Docker Compose
- AWS CLI configured with appropriate permissions

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

## Deployment

### AWS ECS Deployment

This application is configured for deployment on AWS ECS with the following architecture:

1. **Container Registry (ECR)**
   - Store Docker images
   - Automated builds on push

2. **ECS Cluster**
   - Fargate launch type for serverless containers
   - Auto-scaling based on CPU/Memory usage
   - Task definitions for API and database

3. **Application Load Balancer (ALB)**
   - HTTPS termination
   - Health checks
   - SSL/TLS certificate management via ACM

4. **Route 53**
   - Custom domain management
   - DNS routing to ALB
   - Health checks

5. **RDS**
   - Managed PostgreSQL database
   - Automated backups
   - Multi-AZ deployment

### Deployment Steps

1. **Setup AWS Infrastructure**
```bash
# Create ECR repository
aws ecr create-repository --repository-name buda-api

# Create ECS cluster
aws ecs create-cluster --cluster-name buda-cluster

# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier buda-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password <password> \
    --allocated-storage 20
```

2. **Configure CI/CD Pipeline**
   - Build and push Docker image to ECR
   - Update ECS task definitions
   - Deploy to ECS cluster

3. **Setup Domain and SSL**
   - Register domain in Route 53
   - Request SSL certificate in ACM
   - Configure ALB with HTTPS listener

4. **Environment Variables**
   - Store sensitive data in AWS Secrets Manager
   - Configure ECS task definitions with environment variables

### Infrastructure as Code

The deployment infrastructure can be managed using:
- AWS CDK
- Terraform
- CloudFormation

Example AWS CDK stack structure:
```typescript
// infrastructure/lib/buda-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as rds from 'aws-cdk-lib/aws-rds';

export class BudaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'BudaVPC');

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'BudaCluster', {
      vpc,
    });

    // Create RDS Instance
    const database = new rds.DatabaseInstance(this, 'BudaDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14,
      }),
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
    });

    // Create ECS Service
    const service = new ecs.FargateService(this, 'BudaService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(
          ecr.Repository.fromRepositoryName(this, 'BudaRepo', 'buda-api')
        ),
        environment: {
          DATABASE_URL: database.instanceEndpoint.socketAddress,
        },
      },
    });
  }
}
```

## API Endpoints

The API documentation is available at `/api/docs` when the server is running.

### Main Endpoints

- `GET /api/markets` - Get all available markets
- `GET /api/ticker/:market` - Get ticker information for a specific market
- `GET /api/spread/:market` - Get current spread for a market
- `GET /api/spread/:market/last` - Compare current spread with last recorded spread
- `GET /api/spread` - Get spreads for all markets

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
