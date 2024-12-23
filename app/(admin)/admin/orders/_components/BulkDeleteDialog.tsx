"use client";

import { type FC, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Trash2 } from "lucide-react";

type Props = {
  /** 一括削除処理 */
  onDelete: (
    type: "all" | "byDeliveryDate",
    deliveryDate?: Date
  ) => Promise<void>;
};

/**
 * 注文一括削除ダイアログ
 * @description 注文を一括削除する前に確認を行うダイアログ
 */
export const BulkDeleteDialog: FC<Props> = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteType, setDeleteType] = useState<"all" | "byDeliveryDate">();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleDeleteClick = (type: "all" | "byDeliveryDate", date?: Date) => {
    setDeleteType(type);
    setSelectedDate(date);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteType) return;
    await onDelete(deleteType, selectedDate);
    setShowConfirm(false);
    setIsOpen(false);
    setDate(undefined);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDate(undefined);
    setSelectedDate(undefined);
    setDeleteType(undefined);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            一括削除
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>注文を一括削除</AlertDialogTitle>
            <AlertDialogDescription>
              削除方法を選択してください。
              <br />
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
              onClick={() => handleDeleteClick("all")}
            >
              全ての注文を削除
            </Button>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? format(date, "yyyy/MM/dd", { locale: ja })
                    : "配達日を選択して削除"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (newDate) {
                      handleDeleteClick("byDeliveryDate", newDate);
                    }
                    setIsOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              キャンセル
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 確認ダイアログ */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>削除の確認</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === "all" ? (
                "全ての注文を削除します。"
              ) : selectedDate ? (
                <>
                  {format(selectedDate, "M月d日", { locale: ja })}
                  の注文を削除します。
                </>
              ) : null}
              <br />
              この操作は取り消せません。本当に削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
