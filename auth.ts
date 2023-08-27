// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SignInCredentials } from "./app/types";

// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       type: "credentials",
//       credentials: {},
//       async authorize(credentials, request) {
//         const { email, password } = credentials as SignInCredentials;
//         //sed req to you api route to sign in and send err n success
//         const { user, error } = await fetch(
//           "http://localhost:3000/api/users/signin",
//           {
//             method: "POST",
//             body: JSON.stringify({ email, password }),
//           }
//         ).then(async (res) => await res.json());

//         if (error) throw new Error(error);

//         return { id: user.id };
//       },
//     }),
//   ],
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
