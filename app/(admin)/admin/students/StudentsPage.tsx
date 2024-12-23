"use client";

import { type FC, type ComponentProps } from "react";
import { StudentTable } from "./_components/StudentTable";
import { StudentForm } from "./_components/StudentForm";
import { type Student } from "@/lib/types/student";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  /** 生徒一覧データ */
  students: Student[];
};

/**
 * 生徒管理ページのコンポーネント
 * @description 生徒一覧の表示と生徒情報の登録機能を提供します
 */
export const StudentsPage: FC<Props> = ({ students }) => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">生徒管理</h1>
          <p className="text-muted-foreground">
            生徒情報の登録・編集・削除ができます
          </p>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>生徒登録</CardTitle>
            <CardDescription>新しい生徒情報を登録します</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>生徒一覧</CardTitle>
            <CardDescription>
              現在{students.length}人の生徒が登録されています
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentTable students={students} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
