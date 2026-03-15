# API Gateway Dynamic Routes Demo

This project is a small Spring microservices demo for **API Gateway with Dynamic Routes**.

It shows how developers can manage route definitions at runtime while end users access backend services through a single API gateway.

## Services

- `gateway-service`
  - Port: `8080`
  - Entry point for end users
  - Loads route definitions from `route-management-service`
  - Dynamically forwards requests to backend services

- `route-management-service`
  - Port: `8085`
  - Control plane for route definitions
  - Supports create, list, update, and delete
  - Stores routes in Postgres

- `demo-api-service`
  - Port: `8082`
  - Simple backend service for routing demos
  - Exposes `GET /hello`

- `Postgres`
  - Docker port: `5433`
  - Database: `dynamic_routes_demo`
  - User: `demo_user`
  - Password: `demo_pass`

## Architecture

- Developers manage routes through `route-management-service`
- `route-management-service` stores route definitions in Postgres
- `gateway-service` reads those route definitions and builds its active routing table
- End users call the gateway, not the route-management service

In platform terms:

- `route-management-service` = control plane
- `gateway-service` = data plane

## Example Flow

If a developer creates this route:

```json
{
  "id": "demo-route",
  "path": "/demo/**",
  "uri": "http://localhost:8082"
}
```

Then an end user can call:

```bash
GET http://localhost:8080/demo/hello
```

And the gateway forwards the request to:

```bash
http://localhost:8082/hello
```

The backend responds with:

```json
{"message":"Hello from demo service"}
```

## Run the Project

### 1. Start Postgres

```bash
docker compose up -d
```

### 2. Start the services

Start these modules:

- `route-management-service`
- `gateway-service`
- `demo-api-service`

Recommended startup order:

1. `route-management-service`
2. `gateway-service`
3. `demo-api-service`

## Main API Endpoints

### Gateway Service

- `GET /internal/routes`
- `POST /internal/routes`
- `PUT /internal/routes/{id}`
- `DELETE /internal/routes/{id}`
- `GET /actuator/gateway/routes`
- `POST /actuator/gateway/refresh`

Base URL:

```text
http://localhost:8080
```

### Route Management Service

- `GET /routes`
- `POST /routes`
- `PUT /routes/{id}`
- `DELETE /routes/{id}`

Base URL:

```text
http://localhost:8085
```

### Demo API Service

- `GET /hello`

Base URL:

```text
http://localhost:8082
```

## Demo Commands

### Call the gateway before the route exists

```bash
curl -i http://localhost:8080/demo/hello
```

### Create a route through the gateway facade

```bash
curl -X POST http://localhost:8080/internal/routes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "demo-route",
    "path": "/demo/**",
    "uri": "http://localhost:8082"
  }'
```

### Call the gateway after the route exists

```bash
curl -i http://localhost:8080/demo/hello
```

### List routes from route-management-service

```bash
curl http://localhost:8085/routes
```

### Update a route through the gateway facade

```bash
curl -X PUT http://localhost:8080/internal/routes/demo-route \
  -H "Content-Type: application/json" \
  -d '{
    "id": "demo-route",
    "path": "/demo/**",
    "uri": "http://localhost:8082"
  }'
```

### Delete a route through the gateway facade

```bash
curl -X DELETE http://localhost:8080/internal/routes/demo-route
```

## Postman

Ready-to-import Postman collection:

- [postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json](/Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json)

## Notes

- `route-management-service` owns route persistence in Postgres
- `route-management-service` is the owner of route data
- `gateway-service` calls `route-management-service` and applies those routes dynamically
- The actuator refresh endpoint still exists for operational use, even though route creation auto-activates routes
