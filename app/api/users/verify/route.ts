import startDb from "@/app/lib/db";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { EmailVerifyRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/app/lib/email";
import { signIn } from "next-auth/react";

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
    console.log("after link", error);
    return NextResponse.json(
      { error: "could not verify email , something went wrong!" },
      { status: 500 }
    );
  }
};
export const GET = async (req: Request) => {
  try {
    const userId = req.url.split("?userId=")[1];

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { error: "Invalid Request,User_Id Missing" },
        { status: 401 }
      );
    }
    startDb();

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid Request,user Id not found" },
        { status: 401 }
      );
    }
    if (user.verified) {
      return NextResponse.json(
        {
          error: "Invalid Request,user is already verified",
        },
        { status: 401 }
      );
    }

    const token = crypto.randomBytes(36).toString("hex");

    await EmailVerificationToken.findOneAndDelete({ user: userId });

    await EmailVerificationToken.create({
      user: userId,
      token,
    });

    const verificationURL = `${process.env.VERIFICATION_URL}?token=${token}&userId=${userId}`;

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "verification",
      linkUrl: verificationURL,
    });

    return NextResponse.json({ message: "Please Check your mail" });
  } catch (error) {
    return NextResponse.json(
      { error: "could not verify email , something went wrong!" },
      { status: 500 }
    );
  }
};
