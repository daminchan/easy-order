"use client";

import { type FC } from "react";
import { type Student } from "@/lib/types/student";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { updateStudent } from "../../_actions/updateStudent";

/** フォームの型定義 */
const formSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  className: z.string().min(1, "クラスを入力してください"),
  grade: z.coerce.number().min(1).max(3),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  /** 編集対象の生徒情報 */
  student: Student | null;
  /** モーダルの開閉状態 */
  open: boolean;
  /** モーダルの開閉状態を変更するコールバック */
  onOpenChange: (open: boolean) => void;
};

/**
 * 生徒情報編集モーダル
 * @description 生徒の名前、クラス、学年、状態を編集するフォームを提供します
 */
export const EditStudentDialog: FC<Props> = ({
  student,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: student
      ? {
          name: student.name,
          className: student.className,
          grade: student.grade,
          isActive: student.isActive,
        }
      : {
          name: "",
          className: "",
          grade: 1,
          isActive: true,
        },
  });

  if (!student) return null;

  const { id, name } = student;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>生徒情報の編集</DialogTitle>
          <DialogDescription>{name}さんの情報を編集します</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await updateStudent({
                  id,
                  ...values,
                });
                toast({
                  title: "生徒情報を更新しました",
                });
                onOpenChange(false);
              } catch (error) {
                toast({
                  title: "エラーが発生しました",
                  description: "生徒情報の更新に失敗しました",
                  variant: "destructive",
                });
              }
            })}
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>クラス</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学年</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="学年を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1年</SelectItem>
                        <SelectItem value="2">2年</SelectItem>
                        <SelectItem value="3">3年</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状態</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="状態を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">有効</SelectItem>
                        <SelectItem value="false">無効</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                キャンセル
              </Button>
              <Button type="submit">更新</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
