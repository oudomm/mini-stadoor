const gatewayManagementServiceBaseUrl =
  process.env.GATEWAY_MANAGEMENT_SERVICE_BASE_URL ?? "http://localhost:8085";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${gatewayManagementServiceBaseUrl}/services/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({
    message: "Unable to parse gateway-management-service response",
  }));

  return Response.json(payload, { status: response.status });
}
