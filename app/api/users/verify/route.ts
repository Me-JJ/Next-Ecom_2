import startDb from "@/app/lib/db";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
//this route serves the email link token & user_id send through searchParams
export const POST = async (req: Request) => {
  try {
    const { token, userId } = (await req.json()) as EmailVerifyRequest;

    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json(
        { error: "Invalid request, UsedID and token are required" },
        { status: 401 }
      );
    }

    await startDb();
    const verifyToken = await EmailVerificationToken.findOne({ user: userId });

    if (!verifyToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json(
        { error: "Token Does't Match!, Invalid Token" },
        { status: 401 }
      );
    }

    //user is now verified
    await UserModel.findByIdAndUpdate(userId, { verified: true });
    //delete token and render / page
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);

    return NextResponse.json({ message: "Your email is verified" });
  } catch (error) {
    return NextResponse.json(
      { error: "could not verify email , something went wrong!" },
      { status: 500 }
    );
  }
};
