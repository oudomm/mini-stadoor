# Mini Stadoor

Mini Stadoor is a demo for dynamic API gateway registration and route-level security.

It proves:
- developers sign in through `iam-server`
- developers create `Gateway -> Service -> Route`
- management data is owner-scoped per developer
- `standard-gateway` can enforce `NONE`, `BASIC`, `API_KEY`, `JWT`, and `OAUTH2`

## Services

- `developer-portal` on `3000`
- `standard-gateway` on `8080`
- `consumer-service` on `8081`
- `product-service` on `8082`
- `gateway-management-service` on `8085`
- `inventory-service` on `8090`
- `customer-service` on `8091`
- `eureka-server` on `8761`
- `iam-server` on `9090`
- `postgres` on `5433` for demo data and consumer users
- `iam-postgres` on `5434` for IAM data

## Auth Model

- Platform users live in `iam-server`
- Consumer users for `BASIC`, `API_KEY`, and `JWT` live in `consumer-service`
- `gateway-management-service` requires IAM bearer tokens
- `standard-gateway` enforces route auth based on the registered route

## Run

Start databases:

```bash
docker compose up -d postgres iam-postgres
```

Recommended service order:

1. `eureka-server`
2. `iam-server`
3. `gateway-management-service`
4. `consumer-service`
5. `product-service`
6. `standard-gateway`
7. `developer-portal`

Useful entry points:

- Portal: `http://localhost:3000`
- IAM discovery: `http://localhost:9090/.well-known/openid-configuration`
- Eureka: `http://localhost:8761`

## Postman

Use the collection:

- [API-Gateway-Dynamic-Routes-Demo.postman_collection.json](/Users/oudom/Documents/itp/api-gateway-dynamic-routes-demo/postman/API-Gateway-Dynamic-Routes-Demo.postman_collection.json)

Recommended order:

1. `IAM Server -> OIDC Discovery`
2. `Platform IAM -> Open Portal Authorize URL`
3. sign in in a real browser
4. copy the `code` from the callback URL
5. `Platform IAM -> Exchange Portal Authorization Code`
6. `Gateway Setup + Non Auth`
7. `Consumer User -> Register Consumer User`
8. `Basic Auth`, `API Key`, `JWT`, or `OAuth2`

Demo IAM credentials:

- username: `oudom`
- password: `qwer`

Postman OAuth client:

- client id: `mini-stadoor-postman`
- client secret: `mini-stadoor-postman-secret`

## Notes

- `gateway-management-service` stores gateways, services, and routes in Postgres
- `gateway-management-service` ownership is tied to the authenticated IAM developer
- `consumer-service` stores consumer users in Postgres
- `iam-server` stores identity and OAuth2/OIDC data in `iam-postgres`
- `standard-gateway` loads routes dynamically at runtime, not from static config
