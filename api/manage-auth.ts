import type { VercelRequest, VercelResponse } from "@vercel/node";

interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

interface AuthReturnType {
  success: boolean;
  data: AuthToken | string;
}

type AuthBodyBase = {
  client_id: string;
  client_secret: string;
  api_key: string;
};

type RefreshBody = AuthBodyBase & {
  refresh_token: string;
  access_token: string;
};

type LoginBody = AuthBodyBase;

// Helper function to ensure type safety for responses
function sendResponse(
  res: VercelResponse,
  status: number,
  data: AuthReturnType
): void {
  res.status(status).json(data);
}

export default async function manageAuthHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return sendResponse(res, 405, {
      success: false,
      data: "Method Not Allowed",
    });
  }

  const type = req.query.type as "login" | "refresh";

  const client_id = process.env.EKA_CLIENT_ID!;
  const client_secret = process.env.EKA_CLIENT_SECRET!;
  const api_key = process.env.EKA_API_KEY!;

  if (!client_id || !client_secret || !api_key) {
    return sendResponse(res, 400, {
      success: false,
      data: "Missing EKA credentials in environment variables",
    });
  }

  try {
    let body: LoginBody | RefreshBody;

    if (type === "refresh") {
      const { refresh_token, auth_token } = req.body as {
        refresh_token: string;
        auth_token: string;
      };

      if (!refresh_token || !auth_token) {
        return sendResponse(res, 400, {
          success: false,
          data: "Missing refresh or access token in request body",
        });
      }

      body = {
        client_id,
        client_secret,
        api_key,
        refresh_token,
        access_token: auth_token,
      };
    } else {
      body = {
        client_id,
        client_secret,
        api_key,
      };
    }

    const url =
      type === "refresh"
        ? "https://api.eka.care/connect-auth/v1/account/refresh"
        : "https://api.eka.care/connect-auth/v1/account/login";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return sendResponse(res, 400, {
        success: false,
        data: errorText || "Auth failed",
      });
    }

    const data = (await response.json()) as AuthToken;

    return sendResponse(res, 200, {
      success: true,
      data,
    });
  } catch (error) {
    console.error("❌ Auth Error:", error);
    return sendResponse(res, 500, {
      success: false,
      data: String(error),
    });
  }
}

// Export the type for consumers
export type { AuthReturnType, AuthToken };
