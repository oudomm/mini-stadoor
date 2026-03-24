# customer-service

FastAPI demo service for runtime registration and dynamic routing tests.

## Run

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8091
```

## Endpoints

- `GET /customers`
- `GET /customers/{id}`
- `GET /customers/vip`
- `GET /customers?region=phnom-penh`
