"use client";

import { type FC } from "react";
import { type Student } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/** Propsの型定義 */
type Props = {
  /** 表示する生徒情報 */
  student: Student;
};

/** 生徒情報を表示するコンポーネント */
export const StudentProfile: FC<Props> = ({ student }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>生徒情報</CardTitle>
        <CardDescription>あなたの生徒情報です</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">名前</dt>
            <dd className="text-lg">{student.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">学年</dt>
            <dd className="text-lg">{student.grade}年</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              クラス
            </dt>
            <dd className="text-lg">{student.className}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
