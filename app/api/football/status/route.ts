import {
  ApiFootballError,
  getApiFootballStatus,
  isApiFootballConfigured,
} from "@/lib/api-football";

export async function GET() {
  if (!isApiFootballConfigured()) {
    return Response.json(
      {
        configured: false,
        connected: false,
        message: "Add API_FOOTBALL_KEY to .env.local to connect API-Football.",
      },
      { status: 503 },
    );
  }

  try {
    const result = await getApiFootballStatus();

    return Response.json({
      configured: true,
      connected: true,
      plan: result.response.subscription.plan,
      active: result.response.subscription.active,
      requests: {
        current: result.response.requests.current,
        dailyLimit: result.response.requests.limit_day,
      },
    });
  } catch (error) {
    const message =
      error instanceof ApiFootballError
        ? error.message
        : "Unable to connect to API-Football.";

    return Response.json(
      { configured: true, connected: false, message },
      { status: 502 },
    );
  }
}
