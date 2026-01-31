import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SignJWT, jwtVerify } from "jose";

const isE2E = process.env.E2E_TEST_MODE === "true";

const JWT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
function secretBytes(secret: string | Buffer): Uint8Array {
  return typeof secret === "string" ? new TextEncoder().encode(secret) : new Uint8Array(secret);
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(isE2E
      ? [
          CredentialsProvider({
            name: "E2E Test",
            credentials: {
              email: { label: "Email", type: "text" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (
                credentials?.email === "e2e@test.com" &&
                credentials?.password === "e2e-test-password"
              ) {
                return {
                  id: "e2e-test-user-id",
                  name: "E2E Test User",
                  email: "e2e@test.com",
                };
              }
              return null;
            },
          }),
        ]
      : []),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, prefix it with the base url
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If the url is on the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url;
      // Default to the home page
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: JWT_MAX_AGE,
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Use signed JWT (JWS) instead of default encrypted (JWE) so the backend can verify with same secret
  jwt: {
    maxAge: JWT_MAX_AGE,
    async encode({ token, secret, maxAge = JWT_MAX_AGE }) {
      const exp = Math.floor(Date.now() / 1000) + maxAge;
      const payload = { ...token, exp, iat: Math.floor(Date.now() / 1000) };
      return await new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(secretBytes(secret as string | Buffer));
    },
    async decode({ token, secret }) {
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(token, secretBytes(secret as string | Buffer));
        return payload as import("next-auth/jwt").JWT;
      } catch {
        return null;
      }
    },
  },
};