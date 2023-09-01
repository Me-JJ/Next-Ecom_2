"use server";

import startDb from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { UserProfileToUpdate } from "@/app/types";

export const updateUserProfile = async (info: UserProfileToUpdate) => {
  try {
    await startDb();
    // console.log("action->", info);
    await UserModel.findByIdAndUpdate(info.id, {
      name: info.name,
      avatar: info.avatar,
    });
  } catch (error) {
    console.log("error while updating the user");
    throw error;
  }
};
