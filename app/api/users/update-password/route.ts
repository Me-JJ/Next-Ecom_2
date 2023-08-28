import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { ForgetPasswordRequest, UpdatePasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";
import { isValidObjectId } from "mongoose";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  try {
    const { password, token, userId } =
      (await req.json()) as UpdatePasswordRequest;

    if (!password || !token || !isValidObjectId(userId)) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 401 });
    }

    await startDb();
    const resetToken = await PasswordResetTokenModel.findOne({ user: userId });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Unauthorized Request!" },
        { status: 401 }
      );
    }

    const isMatch = resetToken.compareToken(token);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Unauthorized Request!" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "user not found!" }, { status: 404 });
    }

    const isMatched = await user.comparePassword(password);
    if (isMatched) {
      return NextResponse.json(
        { error: "New password must be different!" },
        { status: 401 }
      );
    }
    user.password = password;
    await user.save();

    await PasswordResetTokenModel.findByIdAndDelete(resetToken._id);

    await sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "password-changed",
    });

    return NextResponse.json({
      message: "Your Password is updated successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "could not update password, something went wrong!" },
      { status: 500 }
    );
  }
};
