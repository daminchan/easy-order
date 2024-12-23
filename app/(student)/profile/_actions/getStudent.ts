"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getStudent() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const student = await db.student.findUnique({
      where: { id: userId },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    return student;
  } catch (error) {
    console.error("[GET_STUDENT]", error);
    throw error;
  }
}
