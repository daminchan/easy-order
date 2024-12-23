"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type CreateStudentData = {
  userId: string;
  name: string;
  grade: number;
  className: string;
};

export async function createStudent(data: CreateStudentData) {
  try {
    const student = await db.student.create({
      data: {
        id: data.userId,
        name: data.name,
        grade: data.grade,
        className: data.className,
        isActive: true,
      },
    });

    revalidatePath("/admin/students");
    return student;
  } catch (error) {
    console.error("[CREATE_STUDENT]", error);
    throw error;
  }
}
