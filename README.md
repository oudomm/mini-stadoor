# Mini Stadoor

Mini Stadoor is a small demo for proving dynamic API gateway registration and route protection.

This project is a small Spring microservices demo for **developer service registration + dynamic gateway routing**.

It now includes:
- a Next.js `developer-portal`
- a Spring `consumer-service`
- a Spring `product-service`
- a non-Spring Express `inventory-service`
- a non-Spring FastAPI `customer-service`

It shows how developers can manage route definitions at runtime while end users access backend services through a single API gateway.

## Services

- `standard-gateway`
  - Port: `8080`
  - Public runtime gateway
  - Loads route definitions from `gateway-management-service`
  - Delegates Basic Auth, API key, and JWT validation to `consumer-service` for protected routes
  - Resolves target services through Eureka
  - Forwards traffic dynamically to registered backend services

- `consumer-service`
  - Port: `8081`
  - Internal security service
  - Validates Basic Auth credentials for `standard-gateway`
  - Validates API keys for `standard-gateway`
  - Issues and validates JWT access tokens for `standard-gateway`

- `gateway-management-service`
  - Port: `8085`
  - Platform API for developer onboarding
  - Registers developer services into Eureka by API
  - Stores dynamic routes in Postgres

- `developer-portal`
  - Port: `3000`
  - Developer-facing Next.js website
  - Proxies browser actions to `gateway-management-service`
  - Lets developers register services and create routes from a UI

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
6. `standard-gateway` can enforce JWT validation through `consumer-service`.

## Run the Project

### 1. Start Postgres

```bash
docker compose up -d
```

### 2. Start the services

Start these modules:

- `eureka-server`
- `gateway-management-service`
- `developer-portal`
- `standard-gateway`
- `consumer-service`
- `product-service`
- `inventory-service`
- `customer-service`

Recommended startup order:

1. `eureka-server`
2. `gateway-management-service`
3. `developer-portal`
4. `standard-gateway`
5. `consumer-service`
6. `product-service`

## Main API Endpoints

- `POST http://localhost:8085/gateways`
- `POST http://localhost:8085/services/register`
- `POST http://localhost:8085/routes`
- `POST http://localhost:8081/api/login`
- `POST http://localhost:8081/api/token/validate`
- `GET http://localhost:8080/api/products`
- `GET http://localhost:3000`

## Developer Portal

The UI is branded as **Mini Stadoor** to reflect that this repository is a focused demo, not the full platform.

Start the Next.js website:

```bash
cd /Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/developer-portal
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

From the website, developers can:

- create gateway workspaces
- register backend services
- create dynamic routes
- choose route auth type
- view current routes loaded from `gateway-management-service`

## Demo Flow

### 1. Create a gateway workspace

```bash
curl -X POST http://localhost:8085/gateways \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "gatewayName": "E-Commerce Gateway",
    "description": "Gateway workspace for catalog, checkout, and customer APIs."
  }'
```

### 2. Register a developer service in Eureka

```bash
curl -X POST http://localhost:8085/services/register \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "serviceId": "product-service-manual-1",
    "serviceName": "product-service",
    "address": "localhost",
    "port": 8082,
    "tags": ["manual-registration", "proof"]
  }'
```

### 3. Create a dynamic gateway route

```bash
curl -X POST http://localhost:8085/routes \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "serviceId": "product-service-manual-1",
    "id": "product-route-basic",
    "path": "/basic/products/**",
    "uri": "lb://product-service",
    "authType": "BASIC"
  }'
```

### 4. Call the gateway as an end user

```bash
curl -i -u enduser:enduser123 http://localhost:8080/basic/products
```

## API Key Example

Create a dynamic gateway route with API key protection:

```bash
curl -X POST http://localhost:8085/routes \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "serviceId": "product-service-manual-1",
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

## JWT Example

Create a dynamic gateway route with JWT protection:

```bash
curl -X POST http://localhost:8085/routes \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "serviceId": "product-service-manual-1",
    "id": "product-route-jwt",
    "path": "/jwt/products/**",
    "uri": "lb://product-service",
    "authType": "JWT"
  }'
```

Login to issue access and refresh tokens:

```bash
curl -X POST http://localhost:8081/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "enduser",
    "password": "enduser123"
  }'
```

Validate the access token directly against `consumer-service`:

```bash
curl -X POST http://localhost:8081/api/token/validate \
  -H "Authorization: Bearer <access-token>"
```

Then call the JWT-protected gateway route:

```bash
curl -H "Authorization: Bearer <access-token>" http://localhost:8080/jwt/products
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
    "gatewayId": "ecommerce-gateway",
    "serviceId": "inventory-service-manual-1",
    "serviceName": "inventory-service",
    "address": "localhost",
    "port": 8090,
    "tags": ["express", "manual-registration"]
  }'
```

Create a dynamic route:

```bash
curl -X POST http://localhost:8085/routes \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "serviceId": "inventory-service-manual-1",
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
    "gatewayId": "ecommerce-gateway",
    "serviceId": "customer-service-manual-1",
    "serviceName": "customer-service",
    "address": "localhost",
    "port": 8091,
    "tags": ["fastapi", "manual-registration"]
  }'
```

Create a dynamic route:

```bash
curl -X POST http://localhost:8085/routes \
  -H "Content-Type: application/json" \
  -d '{
    "gatewayId": "ecommerce-gateway",
    "serviceId": "customer-service-manual-1",
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

- `gateway-management-service` registers developer services into Eureka by code
- `gateway-management-service` stores external service registrations in Postgres
- `gateway-management-service` sends scheduled Eureka heartbeats for stored external services
- `consumer-service` is an internal validation service used by `standard-gateway`
- the demo currently implements `NONE`, `BASIC`, `API_KEY`, and `JWT`
- `standard-gateway` resolves `lb://product-service` through Eureka
- the route is created dynamically at runtime, not in `application.yml`
