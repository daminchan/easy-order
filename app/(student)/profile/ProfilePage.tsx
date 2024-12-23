"use client";

import { type FC } from "react";
import { StudentProfile } from "./_components/StudentProfile";
import { useStudent } from "@/hooks/api/student";
import { createStudent } from "./_actions/createStudent";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

/** プロフィールページの実装 */
export const ProfilePage: FC = () => {
  const { student, isLoading } = useStudent();
  const { toast } = useToast();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <h1 className="text-2xl font-bold">プロフィール</h1>
        <div className="flex flex-col items-center justify-center gap-4 p-8 border rounded-lg">
          <p className="text-lg">生徒情報が見つかりません</p>
          <Button
            onClick={async () => {
              try {
                await createStudent();
                toast({
                  title: "生徒情報を作成しました",
                  description: "ページをリロードします",
                });
                window.location.reload();
              } catch (error) {
                toast({
                  title: "エラーが発生しました",
                  description: "生徒情報の作成に失敗しました",
                  variant: "destructive",
                });
              }
            }}
          >
            生徒情報を作成
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">プロフィール</h1>
      <StudentProfile student={student} />
    </div>
  );
};
