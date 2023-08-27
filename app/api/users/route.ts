import startDb from "@/app/lib/db";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { NewUserRequest } from "@/app/types";
import { NextResponse, userAgent } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

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
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5b80522c7dafe0",
      pass: "1f214d2315665f",
    },
  });

  const verificationURL = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: newUser.email,
    html: `<h1>Please verify your email by clicking on <a href="${verificationURL}">this link</a></hi>`,
  });

  return NextResponse.json({ message: "Please check your email!" });
};
