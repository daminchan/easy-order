"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { type Student } from "@/lib/types/student";
import { redirect } from "next/navigation";

/**
 * 生徒一覧を取得する
 * @description 管理者権限を確認した上で、生徒一覧を取得します
 * @throws {Error} 管理者権限がない場合
 * @returns {Promise<Student[]>} 生徒一覧
 */
export async function getStudents(): Promise<Student[]> {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    // 管理者権限の確認
    const admin = await db.admin.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new Error("管理者権限がありません");
    }

    // 生徒一覧の取得
    const students = await db.student.findMany({
      orderBy: [{ grade: "asc" }, { className: "asc" }, { name: "asc" }],
    });

    return students;
  } catch (error) {
    console.error("[GET_STUDENTS]", error);
    throw error;
  }
}
