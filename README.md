# API Gateway Dynamic Routes Demo

This project is a small Spring microservices demo for **developer service registration + dynamic gateway routing**.

It now includes:
- a Spring `product-service`
- a non-Spring Express `inventory-service`
- a non-Spring FastAPI `customer-service`

It shows how developers can manage route definitions at runtime while end users access backend services through a single API gateway.

## Services

- `standard-gateway`
  - Port: `8080`
  - Entry point for end users
  - Loads route definitions from `gateway-service`
  - Resolves target services through Eureka
  - Forwards end-user traffic dynamically

- `gateway-service`
  - Port: `8085`
  - Platform API for developer onboarding
  - Registers developer services into Eureka by API
  - Stores dynamic routes in Postgres

- `product-service`
  - Port: `8082`
  - Plain backend API used for routing demos
  - Exposes product endpoints
  - Runs as a plain backend service and is registered through the platform API during the demo

- `inventory-service`
  - Port: `8090`
  - Express-based backend API for cross-language registration tests
  - Exposes inventory endpoints
  - Proves developer services do not have to be Spring Boot

- `customer-service`
  - Port: `8091`
  - FastAPI-based backend API for cross-language registration tests
  - Exposes customer endpoints
  - Proves developer services do not have to be Node.js or Spring Boot

- `eureka-server`
  - Port: `8761`
  - Service discovery for the demo services

- `Postgres`
  - Docker port: `5433`
  - Database: `dynamic_routes_demo`
  - User: `demo_user`
  - Password: `demo_pass`

## What This Demo Proves

1. A developer service can be registered at runtime by platform code.
2. A route can be created dynamically instead of being hardcoded in `application.yml`.
3. End users access only the gateway URL, not the backend service directly.

## Run the Project

### 1. Start Postgres

```bash
docker compose up -d
```

### 2. Start the services

Start these modules:

- `eureka-server`
- `gateway-service`
- `standard-gateway`
- `product-service`
- `inventory-service`
- `customer-service`

Recommended startup order:

1. `eureka-server`
2. `gateway-service`
3. `standard-gateway`
4. `product-service`

## Main API Endpoints

- `POST http://localhost:8085/services/register`
- `POST http://localhost:8080/internal/routes`
- `GET http://localhost:8080/api/products`

## Demo Flow

### 1. Register a developer service in Eureka

```bash
curl -X POST http://localhost:8085/services/register \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "product-service-manual-1",
    "serviceName": "product-service",
    "address": "localhost",
    "port": 8082,
    "tags": ["manual-registration", "proof"]
  }'
```

### 2. Create a dynamic gateway route

```bash
curl -X POST http://localhost:8080/internal/routes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "product-route",
    "path": "/api/products/**",
    "uri": "lb://product-service"
  }'
```

### 3. Call the gateway as an end user

```bash
curl -i http://localhost:8080/api/products
```

## Express Example

Start the non-Spring sample service:

```bash
cd /Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/inventory-service
npm install
npm start
```

Register it in Eureka:

```bash
curl -X POST http://localhost:8085/services/register \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "inventory-service-manual-1",
    "serviceName": "inventory-service",
    "address": "localhost",
    "port": 8090,
    "tags": ["express", "manual-registration"]
  }'
```

Create a dynamic route:

```bash
curl -X POST http://localhost:8080/internal/routes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "inventory-route",
    "path": "/api/inventory/**",
    "uri": "lb://inventory-service"
  }'
```

Then test through the gateway:

```bash
curl http://localhost:8080/api/inventory/items
curl http://localhost:8080/api/inventory/items/i-100
curl http://localhost:8080/api/inventory/items/low-stock
```

## FastAPI Example

Start the FastAPI sample service:

```bash
cd /Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/customer-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8091
```

Register it in Eureka:

```bash
curl -X POST http://localhost:8085/services/register \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "customer-service-manual-1",
    "serviceName": "customer-service",
    "address": "localhost",
    "port": 8091,
    "tags": ["fastapi", "manual-registration"]
  }'
```

Create a dynamic route:

```bash
curl -X POST http://localhost:8080/internal/routes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "customer-route",
    "path": "/api/customers/**",
    "uri": "lb://customer-service"
  }'
```

Then test through the gateway:

```bash
curl http://localhost:8080/api/customers
curl http://localhost:8080/api/customers/c-100
curl http://localhost:8080/api/customers/vip
```

## Postman

Ready-to-import Postman collection:

- [postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json](/Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json)

## Notes

- `gateway-service` registers developer services into Eureka by code
- `gateway-service` stores external service registrations in Postgres
- `gateway-service` sends scheduled Eureka heartbeats for stored external services
- `standard-gateway` resolves `lb://product-service` through Eureka
- the route is created dynamically at runtime, not in `application.yml`
