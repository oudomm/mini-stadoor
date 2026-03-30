const express = require("express");

const app = express();
const port = process.env.PORT || 8090;

const items = [
  { id: "i-100", name: "Laptop Stand", stock: 42, warehouse: "phnom-penh" },
  { id: "i-200", name: "Wireless Mouse", stock: 8, warehouse: "singapore" },
  { id: "i-300", name: "USB-C Cable", stock: 120, warehouse: "shenzhen" }
];

app.get("/inventory/items", (req, res) => {
  const { warehouse } = req.query;

  if (!warehouse) {
    return res.json(items);
  }

  return res.json(
    items.filter((item) => item.warehouse.toLowerCase() === String(warehouse).toLowerCase())
  );
});

app.get("/inventory/items/low-stock", (req, res) => {
  res.json(items.filter((item) => item.stock < 10));
});

app.get("/inventory/items/:id", (req, res) => {
  const item = items.find((candidate) => candidate.id === req.params.id);

  if (!item) {
    return res.status(404).json({ message: `Item not found: ${req.params.id}` });
  }

  return res.json(item);
});

app.listen(port, () => {
  console.log(`inventory-service listening on http://localhost:${port}`);
});
