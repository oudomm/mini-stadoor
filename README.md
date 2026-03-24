# API Gateway Dynamic Routes Demo

This project is a small Spring microservices demo for **developer service registration + dynamic gateway routing**.

It now includes:
- a Spring `consumer-service`
- a Spring `product-service`
- a non-Spring Express `inventory-service`
- a non-Spring FastAPI `customer-service`

It shows how developers can manage route definitions at runtime while end users access backend services through a single API gateway.

## Services

- `standard-gateway`
  - Port: `8080`
  - Public runtime gateway
  - Loads route definitions from `gateway-service`
  - Delegates Basic Auth validation to `consumer-service` for protected routes
  - Resolves target services through Eureka
  - Forwards traffic dynamically to registered backend services

- `consumer-service`
  - Port: `8081`
  - Internal security service
  - Validates Basic Auth credentials for `standard-gateway`
  - Will later grow to support API key and JWT validation

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
3. End users access only `standard-gateway`, not the backend service directly.
4. `standard-gateway` can enforce Basic Auth by delegating validation to `consumer-service`.
5. `standard-gateway` can also enforce API key validation through `consumer-service`.

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
- `consumer-service`
- `product-service`
- `inventory-service`
- `customer-service`

Recommended startup order:

1. `eureka-server`
2. `gateway-service`
3. `standard-gateway`
4. `consumer-service`
5. `product-service`

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
    "uri": "lb://product-service",
    "authType": "BASIC"
  }'
```

### 3. Call the gateway as an end user

```bash
curl -i -u enduser:enduser123 http://localhost:8080/api/products
```

## API Key Example

Create a dynamic gateway route with API key protection:

```bash
curl -X POST http://localhost:8080/internal/routes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "product-route-api-key",
    "path": "/api-key/products/**",
    "uri": "lb://product-service",
    "authType": "API_KEY"
  }'
```

Then call it with the demo API key:

```bash
curl -H "X-API-Key: stadoor-demo-key" http://localhost:8080/api-key/products
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
    "uri": "lb://inventory-service",
    "authType": "BASIC"
  }'
```

Then test through the gateway:

```bash
curl -u enduser:enduser123 http://localhost:8080/api/inventory/items
curl -u enduser:enduser123 http://localhost:8080/api/inventory/items/i-100
curl -u enduser:enduser123 http://localhost:8080/api/inventory/items/low-stock
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
    "uri": "lb://customer-service",
    "authType": "BASIC"
  }'
```

Then test through the gateway:

```bash
curl -u enduser:enduser123 http://localhost:8080/api/customers
curl -u enduser:enduser123 http://localhost:8080/api/customers/c-100
curl -u enduser:enduser123 http://localhost:8080/api/customers/vip
```

## Postman

Ready-to-import Postman collection:

- [postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json](/Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json)

## Notes

- `gateway-service` registers developer services into Eureka by code
- `gateway-service` stores external service registrations in Postgres
- `gateway-service` sends scheduled Eureka heartbeats for stored external services
- `consumer-service` is an internal validation service used by `standard-gateway`
- the demo currently implements `BASIC` and `API_KEY`, with `JWT` left for later
- `standard-gateway` resolves `lb://product-service` through Eureka
- the route is created dynamically at runtime, not in `application.yml`
