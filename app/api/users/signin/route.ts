import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { SignInCredentials } from "@/app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignInCredentials;

  // console.log("route signin->", email, password);
  if (!email || !password)
    return NextResponse.json({
      error: "Invalid request, email and password are missing",
    });

  await startDb();

  const user = await UserModel.findOne({ email });
  if (!user) return NextResponse.json({ error: "Email mismatch!" });

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) return NextResponse.json({ error: "Password mismatch!" });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url,
      role: user.role,
      verified: user.verified,
    },
  });
};
