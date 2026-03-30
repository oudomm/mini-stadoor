import { getPortalSession } from "@/lib/platform-auth";

const consumerServiceBaseUrl =
  process.env.CONSUMER_SERVICE_BASE_URL ?? "http://localhost:8081";

export async function POST(request: Request) {
  const session = await getPortalSession();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetch(`${consumerServiceBaseUrl}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Owner-User-Uuid": session.userUuid,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({ message: "Unable to parse consumer-service response" }));
  return Response.json(payload, { status: response.status });
}
