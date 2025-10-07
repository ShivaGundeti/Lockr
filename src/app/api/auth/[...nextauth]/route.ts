import NextAuth, { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { IUser, User as UserModel } from "../../../../../lib/model/user";
import CryptoJS from "crypto-js";
import { ConnectDB } from "../../../../../lib/config/db";

// Extend JWT type
interface MyJWT extends JWT {
  id?: string;

}

// Extend Session type
interface MySession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
   
  };
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
          await ConnectDB()
          const bytes = CryptoJS.AES.decrypt(
            credentials!.encryptedData,
            process.env.CRYPTO_SECRET_KEY!
          );
          const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          const input = decrypted;

          

          if (!input?.email || !input?.password)
            throw new Error("Missing email or password");

          const res = await UserModel.findOne({ email: input.email }).lean();
          if (!res) throw new Error("No user found");

          const isValid = await bcrypt.compare(input.password, res.password);
          if (!isValid) throw new Error("Invalid password");

          return {
            id: res._id.toString(),
            name: res.name,
            email: res.email,
          };
        } catch (error) {
       
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }: { token: MyJWT; user?: User }) {
      if (user) {
        token.id = user.id;

      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = (token as any).id;
      } else {
        session.user = { name: token.name ?? null, email: token.email ?? null };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
