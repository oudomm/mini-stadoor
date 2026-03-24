from fastapi import FastAPI, HTTPException, Query

app = FastAPI(title="customer-service")

customers = [
    {"id": "c-100", "name": "Alice Sok", "tier": "vip", "region": "phnom-penh"},
    {"id": "c-200", "name": "Bora Chan", "tier": "standard", "region": "siem-reap"},
    {"id": "c-300", "name": "Dara Lim", "tier": "vip", "region": "singapore"},
]


@app.get("/customers")
def list_customers(region: str | None = Query(default=None)) -> list[dict]:
    if not region:
        return customers

    normalized_region = region.lower()
    return [
        customer
        for customer in customers
        if customer["region"].lower() == normalized_region
    ]


@app.get("/customers/vip")
def list_vip_customers() -> list[dict]:
    return [customer for customer in customers if customer["tier"] == "vip"]


@app.get("/customers/{customer_id}")
def get_customer(customer_id: str) -> dict:
    for customer in customers:
        if customer["id"] == customer_id:
            return customer

    raise HTTPException(status_code=404, detail=f"Customer not found: {customer_id}")
