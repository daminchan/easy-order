"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createStudent() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const student = await db.student.create({
      data: {
        id: userId,
        name: "未設定",
        grade: 1,
        className: "未設定",
        isActive: true,
      },
    });

    revalidatePath("/profile");
    return student;
  } catch (error) {
    console.error("[CREATE_STUDENT]", error);
    throw error;
  }
}
