import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import authService from "@/services/authService";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

interface CustomUser {
  id: string;
  accessToken: string;
  accessTokenExpires: number;
}

export function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedPayload: Record<string, any> = {};
    for (const key in payload) {
      const shortKey = key.includes("/") ? key.split("/").pop()! : key;
      normalizedPayload[shortKey] = payload[key];
    }
    return normalizedPayload;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const response = await authService.login({
          email: credentials.email,
          password: credentials.password,
        });
        const data = response.data;
        if (data?.is_succes && data?.access_token) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { exp }: any = parseJwt(data.access_token);
          return {
            id: credentials.email,
            accessToken: data.access_token,
            accessTokenExpires: exp * 1000,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.accessToken = customUser.accessToken;
        token.accessTokenExpires = customUser.accessTokenExpires;
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      try {
        const res = await authService.refreshToken();
        const newToken = res.data?.access_token;
        if (newToken) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { exp }: any = parseJwt(newToken);
          token.accessToken = newToken;
          token.accessTokenExpires = exp * 1000;
          return token;
        }
        token.error = "RefreshFailed";
        return token;
      } catch {
        token.error = "RefreshFailed";
        return token;
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
