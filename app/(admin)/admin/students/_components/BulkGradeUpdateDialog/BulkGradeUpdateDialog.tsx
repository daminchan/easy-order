"use client";

import { type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { bulkUpdateGrade } from "../../_actions/bulkUpdateGrade";

/** フォームの型定義 */
const formSchema = z.object({
  fromGrade: z.coerce.number().min(1).max(3),
  toGrade: z.coerce.number().min(1).max(3),
});

type FormValues = z.infer<typeof formSchema>;

type BulkGradeUpdateDialogProps = {
  /** モーダルの開閉状態 */
  open: boolean;
  /** モーダルの開閉状態を変更するコールバック */
  onOpenChange: (open: boolean) => void;
};

/**
 * 学��一括更新モーダル
 * @description 指定した学年の生徒を一括で別の学年に更新するフォームを提供します
 */
export const BulkGradeUpdateDialog: FC<BulkGradeUpdateDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromGrade: 1,
      toGrade: 2,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>学年一括更新</DialogTitle>
          <DialogDescription>
            指定した学年の生徒を一括で更新します
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(async ({ fromGrade, toGrade }) => {
              try {
                await bulkUpdateGrade({ fromGrade, toGrade });
                toast({
                  title: "学年を一括更新しました",
                  description: `${fromGrade}年生を${toGrade}年生に更新しました`,
                });
                onOpenChange(false);
              } catch (error) {
                toast({
                  title: "エラーが発生しました",
                  description: "学年の一括更新に失敗しました",
                  variant: "destructive",
                });
              }
            })}
          >
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="fromGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>更新対象の学年</FormLabel>
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
                name="toGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>更新後の学年</FormLabel>
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
