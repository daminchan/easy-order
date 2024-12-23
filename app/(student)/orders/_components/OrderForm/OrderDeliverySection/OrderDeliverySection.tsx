"use client";

import { type FC } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Order } from "@/lib/types/order";

/** 配達日選択セクションのProps */
type Props = {
  /** 選択された配達日 */
  selectedDate: Date | null;
  /** 配達日変更時のハンドラ */
  onDateChange: (date: Date | null) => Promise<void>;
  /** 既存の注文情報 */
  existingOrder: Order | null;
  /** 利用可能な配達日リスト */
  availableDeliveryDates: { deliveryDate: Date; orderDeadline: Date }[];
  /** 既存の注文を表示 */
  onViewExistingOrder: (orderId: Order["id"]) => void;
};

/** 配達日選択セクション */
export const OrderDeliverySection: FC<Props> = ({
  selectedDate,
  onDateChange,
  existingOrder,
  availableDeliveryDates,
  onViewExistingOrder,
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <label className="text-lg font-semibold text-gray-900">
        配達日を選択
      </label>
      <span className="text-sm font-medium text-red-500">*</span>
    </div>
    <Select
      value={selectedDate?.toISOString() ?? ""}
      onValueChange={(value) => onDateChange(value ? new Date(value) : null)}
    >
      <SelectTrigger className="w-full text-base">
        <SelectValue placeholder="選択してください">
          {selectedDate && (
            <span className="font-medium">
              {format(selectedDate, "M月d日(E)", { locale: ja })}
              の注文
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableDeliveryDates.map(({ deliveryDate, orderDeadline }) => (
          <SelectItem
            key={deliveryDate.toISOString()}
            value={deliveryDate.toISOString()}
            className="py-3"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">
                {format(deliveryDate, "M月d日(E)", { locale: ja })}の注文
              </span>
              <span className="text-sm text-red-500">
                注文締切：
                {format(orderDeadline, "M/d(E) HH:mm", { locale: ja })}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {existingOrder && (
      <Alert variant="default" className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">
          この配達日には既に注文が存在します
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="text-yellow-700 mb-4">
            注文内容を変更する場合は、まず既存の注文をキャンセルしてから新しい注文を作成してください。
          </p>
          <Button
            variant="outline"
            onClick={() =>
              existingOrder && onViewExistingOrder(existingOrder.id)
            }
            className="border-yellow-200 text-yellow-800 hover:bg-yellow-100"
          >
            既存の注文を確認
          </Button>
        </AlertDescription>
      </Alert>
    )}
  </div>
);
