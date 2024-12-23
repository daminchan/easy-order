"use client";

import { type FC, useState } from "react";
import { type Student } from "@/lib/types/student";
import { type ComponentProps } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EditStudentDialog } from "../EditStudentDialog";
import { BulkGradeUpdateDialog } from "../BulkGradeUpdateDialog";
import { deleteStudent } from "../../_actions/deleteStudent";

/** EditStudentDialogの型 */
type EditStudentDialogProps = ComponentProps<typeof EditStudentDialog>;
/** BulkGradeUpdateDialogの型 */
type BulkGradeUpdateDialogProps = ComponentProps<typeof BulkGradeUpdateDialog>;

type Props = {
  /** 生徒一覧データ */
  students: Student[];
};

/**
 * 生徒一覧を表示するテーブルコンポーネント
 * @description 生徒情報の表示、編集、削除、一括学年更新機能を提供します
 */
export const StudentTable: FC<Props> = ({ students }) => {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkUpdateDialogOpen, setIsBulkUpdateDialogOpen] = useState(false);

  /** 編集ダイアログの開閉状態を変更 */
  const handleEditDialogOpenChange: EditStudentDialogProps["onOpenChange"] = (
    open
  ) => {
    setIsEditDialogOpen(open);
    if (!open) setSelectedStudent(null);
  };

  /** 一括更新ダイアログの開閉状態を変更 */
  const handleBulkUpdateDialogOpenChange: BulkGradeUpdateDialogProps["onOpenChange"] =
    (open) => {
      setIsBulkUpdateDialogOpen(open);
    };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsBulkUpdateDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          学年一括更新
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">クラス</TableHead>
              <TableHead>名前</TableHead>
              <TableHead className="w-[100px]">学年</TableHead>
              <TableHead className="w-[100px]">状態</TableHead>
              <TableHead className="w-[200px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(
              ({
                id,
                className,
                name,
                grade,
                isActive,
                createdAt,
                updatedAt,
              }) => (
                <TableRow key={id}>
                  <TableCell>{className}</TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{grade}年</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isActive ? "有効" : "無効"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStudent({
                          id,
                          className,
                          name,
                          grade,
                          isActive,
                          createdAt,
                          updatedAt,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      編集
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          await deleteStudent(id);
                          toast({
                            title: "生徒情報を削除しました",
                          });
                        } catch {
                          toast({
                            title: "エラーが発生しました",
                            description: "生徒情報の削除に失敗しました",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      <EditStudentDialog
        student={selectedStudent}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogOpenChange}
      />

      <BulkGradeUpdateDialog
        open={isBulkUpdateDialogOpen}
        onOpenChange={handleBulkUpdateDialogOpenChange}
      />
    </div>
  );
};
