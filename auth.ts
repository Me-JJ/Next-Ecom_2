// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { SignInCredentials } from "./app/types";

// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Creds",
//       credentials: {},
//       async authorize(credentials, req) {
//         // console.log("route next-auth->", credentials);

//         const { email, password } = credentials as SignInCredentials;
//         //send req to you api route to sign in and send err n success
//         const { user, error } = await fetch(
//           "http://localhost:3000/api/users/signin",
//           {
//             method: "POST",
//             body: JSON.stringify({ email, password }),
//           }
//         ).then(async (res) => await res.json());

//         if (error) {
//           return null;
//         }

//         return { id: user.id };
//       },
//     }),
//   ],
// };

// export const {
//   auth,
//   handlers: { GET, POST },
// } = NextAuth(authOptions);

// stripe listen --forward-to localhost:3000/api/webhook
