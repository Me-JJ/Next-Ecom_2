import startDb from "@/app/lib/db";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { NewUserRequest } from "@/app/types";
import { NextResponse, userAgent } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const verificationURL = `${process.env.NEXTAUTH_URL}verify?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    subject: "verification",
    linkUrl: verificationURL,
  });

  return NextResponse.json({ message: "Please check your email!" });
};
