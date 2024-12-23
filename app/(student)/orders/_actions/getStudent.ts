"use server";

import { db } from "@/lib/db";
import { type Student } from "@prisma/client";

type GetStudentResponse = {
  student?: Student;
  error?: string;
};

/** ログイン中の生徒データを取得する */
export const getStudent = async (
  userId: string
): Promise<GetStudentResponse> => {
  try {
    console.log("Debug - Attempting to find student with ID:", userId);

    // すべての生徒データを取得して確認
    const allStudents = await db.student.findMany();
    console.log("Debug - All students in database:", allStudents);

    const student = await db.student.findUnique({
      where: { id: userId },
    });

    console.log("Debug - Found student:", student);

    if (!student) {
      return { error: "生徒情報が見つかりませんでした" };
    }

    return { student };
  } catch (error) {
    console.error("Debug - Database error:", error);
    return { error: "生徒情報の取得に失敗しました" };
  }
};
