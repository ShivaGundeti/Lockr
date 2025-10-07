import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { ConnectDB } from "../../../../../lib/config/db";
import { User as UserModel } from "../../../../../lib/model/user";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      id?: string;
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        encryptedData: { label: "encryptedData", type: "text" },
      },
      async authorize(credentials) {
        try {
          await ConnectDB();

          const bytes = CryptoJS.AES.decrypt(
            credentials!.encryptedData,
            process.env.CRYPTO_SECRET_KEY!
          );
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          const input = decrypted;

          if (!input?.email || !input?.password)
            throw new Error("Missing email or password");

          const user = await UserModel.findOne({ email: input.email }).lean();
          if (!user) throw new Error("No user found");

          const isValid = await bcrypt.compare(input.password, user.password);
          if (!isValid) throw new Error("Invalid password");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: { id?: string } }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (session.user) session.user.id = (token as any).id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import { NextRequest } from "next/server";

// ✅ App Router route handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
