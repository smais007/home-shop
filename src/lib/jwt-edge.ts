// Edge Runtime compatible JWT utilities using Web Crypto API
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key-change-in-production";

export interface JWTPayload {
  adminId: string;
  email: string;
}

// Convert string secret to Uint8Array for jose
const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET);
};

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  const token = await new SignJWT({
    adminId: payload.adminId,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());

  return token;
};

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
