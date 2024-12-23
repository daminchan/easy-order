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
    const student = await db.student.findUnique({
      where: { id: userId },
    });

    if (!student) {
      return { error: "生徒情報が見つかりませんでした" };
    }

    return { student };
  } catch {
    return { error: "生徒情報の取得に失敗しました" };
  }
};
