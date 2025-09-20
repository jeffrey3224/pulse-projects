import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET is not defined in environment");

export type AuthPayload = { id: number; email?: string };

export interface AuthenticatedNextApiRequest extends NextApiRequest { 
  user?: AuthPayload
}

function parseCookies(cookieHeader?: string) {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach((pair) => {
    const [k, ...v] = pair.trim().split("=");
    if (!k) return;
    out[k] = decodeURIComponent(v.join("="));
  });
  return out;
}

export function withAuth(handler: (req: AuthenticatedNextApiRequest, res: NextApiResponse) => Promise<void> | void) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      let token: string | undefined;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
      else {
        const cookies = parseCookies(req.headers.cookie);
        if (cookies.token) token = cookies.token;
      }

      if (!token) {
        return res.status(401).json({ error: "No token provided"});
      }

      const decoded = jwt.verify(token, SECRET)

      if (typeof decoded !== "object" || !decoded || !("id" in decoded)) {
        return res.status(401).json({ error: "Invalid token payload" })
      }
      (req as AuthenticatedNextApiRequest).user = { id: (decoded as any).id, email: (decoded as any).email };
    return handler(req as AuthenticatedNextApiRequest, res);
    }
    catch (err) {
      console.error("Auth error:", err);
      return res.status(401).json({ error: "Invalid or expired token"})
    }
  } 
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d"});
}

export function verifyToken(token: string): AuthPayload {
  const decoded = jwt.verify(token, SECRET) as AuthPayload;
  return decoded;
}