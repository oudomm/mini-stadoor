import { getPortalSession } from "@/lib/platform-auth";

const gatewayManagementServiceBaseUrl =
  process.env.GATEWAY_MANAGEMENT_SERVICE_BASE_URL ?? "http://localhost:8085";

export async function GET() {
  const session = await getPortalSession();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${gatewayManagementServiceBaseUrl}/routes`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({ routes: [] }));
  return Response.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const session = await getPortalSession();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const response = await fetch(`${gatewayManagementServiceBaseUrl}/routes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
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
