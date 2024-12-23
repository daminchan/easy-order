import { type FC } from "react";
import { StudentsPage } from "./StudentsPage";
import { getStudents } from "./_actions/getStudents";
import { redirect } from "next/navigation";

/**
 * 生徒管理ページ
 * @description 管理者権限を確認した上で、生徒一覧を表示します
 */
const Page: FC = async () => {
  try {
    // 管理者権限の確認と生徒一覧の取得を行う
    const students = await getStudents();
    return <StudentsPage students={students} />;
  } catch (error) {
    // 管理者権限がない場合はトップページにリダイレクト
    console.error("[STUDENTS_PAGE]", error);
    redirect("/");
  }
};

export default Page;
