// export { GET, POST } from "@/auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionUserProfile, SignInCredentials } from "@app/types";

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Creds",
      credentials: {},
      async authorize(credentials, req) {
        // console.log("route next-auth->", credentials);

        const { email, password } = credentials as SignInCredentials;
        //send req to you api route to sign in and send err n success
        const { user, error } = await fetch(
          "http://localhost:3000/api/users/signin",
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => await res.json());

        if (error) {
          return null;
        }
        return { id: user.id, ...user };
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token = { ...params.token, ...params.user };
      }
      // console.log("jwt callback->", params.token);
      return params.token;
    },
    async session(params) {
      const user = params.token as typeof params.token & SessionUserProfile;
      if (user) {
        params.session.user = {
          ...params.session.user,
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          verified: user.verified,
          role: user.role,
        };
      }
      return params.session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
