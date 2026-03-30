# Mini Stadoor

Mini Stadoor is a demo for dynamic API gateway registration with hierarchical security policies.

It proves:
- developers sign in through `iam-server`
- developers create `Gateway -> Service -> Route`
- gateways are grouped into an internal `GatewayWorkspace` layer (`API` or `BFF`)
- each registered service is advertised through Eureka, and the gateway relies on service discovery for instance routing
- management data is owner-scoped per developer
- `standard-gateway` resolves auth from gateway defaults, optional service policies, and route overrides
- consumer identities are created inside a gateway in `consumer-service`
- `consumer-service` stores `Consumer -> BasicAuthCredential / ApiKeyCredential / JwtProvisioning`
- `standard-gateway` validates `BASIC`, `API_KEY`, and `JWT` credentials against both the credential and the owning gateway

## Services

- `mini-stadoor-ui` on `3000`
- `standard-gateway` on `8080`
- `consumer-service` on `8081`
- `product-service` on `8082`
- `gateway-management-service` on `8085`
- `inventory-service` on `8090`
- `customer-service` on `8091`
- `eureka-server` on `8761`
- `iam-server` on `9090`
- `postgres` on `5433` for `gateway-management-service` and `consumer-service` databases
- `iam-postgres` on `5434` for IAM data

## Auth Model

- Platform users live in `iam-server`
- Gateway-scoped consumer identities for `BASIC`, `API_KEY`, and `JWT` live in `consumer-service`
- `gateway-management-service` requires IAM bearer tokens
- gateway defines a default security type (`NONE`, `BASIC`, `API_KEY`, or `JWT`)
- service can optionally define its own security type; if set, all routes under that service inherit it
- if service security is not set, each route can set its own security type
- if route security is not set, route falls back to the gateway default
- effective precedence is `service -> route -> gateway default`
- `standard-gateway` enforces the resolved auth type on each route
- consumer credentials are valid only inside the gateway that owns the consumer

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
7. `mini-stadoor-ui`

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
8. `Consumer User -> List Consumers`
9. run one protected flow: `Basic Auth`, `API Key`, or `JWT`
10. optional: `OAuth2`

Postman demo notes:

- `Create Gateway` sets the gateway default policy
- each protected Postman folder now creates its own matching gateway before registering the service and route
- `Consumer User` now needs a `consumerGatewayId`; set it to the gateway you want to test before registering or logging in a consumer
- consumer identities are reusable inside their gateway workspace, not across every gateway globally
- `JWT` includes both token issuance and token validation before the protected route call
- services and routes now inherit security automatically from the gateway, so their request bodies no longer need `authType`

Demo IAM credentials:

- username: `oudom`
- password: `qwer`

Postman OAuth client:

- client id: `mini-stadoor-postman`
- client secret: `mini-stadoor-postman-secret`

## Notes

- `gateway-management-service` stores gateway workspaces, gateways, services, and routes while relying on Eureka for instance discovery and load balancing
- `gateway-management-service` uses the `gateway_management_service_db` database
- `gateway-management-service` ownership is tied to the authenticated IAM developer
- `consumer-service` stores gateway-scoped consumers and credential tables in Postgres
- `consumer-service` uses the `consumer_service_db` database
- `iam-server` stores identity and OAuth2/OIDC data in `iam-postgres`
- `standard-gateway` loads routes dynamically at runtime, not from static config
