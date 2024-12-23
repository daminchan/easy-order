"use client";

import { type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";
import { createStudent } from "../../_actions/createStudent";

const formSchema = z.object({
  userId: z.string().min(1, "ユーザーIDを入力してください"),
  name: z.string().min(1, "生徒名を入力してください"),
  grade: z.coerce
    .number()
    .min(1, "学年は1以上を入力してください")
    .max(3, "学年は3以下を入力してください"),
  className: z.string().min(1, "クラスを入力してください"),
});

type FormData = z.infer<typeof formSchema>;

/** 生徒情報登録フォームの実装 */
export const StudentForm: FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      name: "",
      grade: 1,
      className: "",
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      await createStudent(data);
      form.reset();
      toast({
        title: "登録完了",
        description: "生徒情報を登録しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "生徒情報の登録に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザーID</FormLabel>
              <FormControl>
                <Input placeholder="Clerk ユーザーIDを入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>生徒名</FormLabel>
              <FormControl>
                <Input placeholder="生徒名を入力" {...field} />
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
              <FormControl>
                <Input type="number" min={1} max={3} {...field} />
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
                <Input placeholder="クラスを入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">登録</Button>
      </form>
    </Form>
  );
};
