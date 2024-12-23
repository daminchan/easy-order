/** 管理者情報 */
export type Admin = {
  /** システム内部ID（ClerkのユーザーIDと同じ） */
  id: string;
  /** 管理者名 */
  name: string;
  /** 役職 */
  role: AdminRole;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};

/** 管理者の役職 */
export const AdminRole = {
  /** スタッフ */
  STAFF: "STAFF",
  /** 管理者 */
  MANAGER: "MANAGER",
} as const;

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];
