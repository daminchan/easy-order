"use server";

import { db } from "@/lib/db";

/**
 * 管理者権限をチェックする
 * @param userId ユーザーID
 * @returns 管理者権限の有無
 */
export async function checkIsAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false;

  try {
    const admin = await db.admin.findUnique({
      where: { id: userId },
    });
    return !!admin;
  } catch (error) {
    console.error("[CHECK_IS_ADMIN]", error);
    return false;
  }
}
