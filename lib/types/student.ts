/** 生徒情報 */
export type Student = {
  /** システム内部ID */
  id: string;
  /** クラス名 */
  className: string;
  /** 生徒名 */
  name: string;
  /** 学年 */
  grade: number;
  /** アカウント状態 */
  isActive: boolean;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};

/** 生徒の認証情報 */
export type StudentAuth = {
  /** ログインID（学籍番号） */
  loginId: string;
  /** パスワード */
  password: string;
};
