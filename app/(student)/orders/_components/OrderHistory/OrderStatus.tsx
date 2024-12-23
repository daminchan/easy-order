"use client";
import { type FC } from "react";

import { Badge } from "@/components/ui/badge";

/** 注文状態表示コンポーネントのProps */
type OrderStatusProps = {
  /** 注文のステータス */
  status: "active" | "cancelled";
  /** 受け取り済みかどうか */
  isReceived: boolean;
};

/** 注文状態表示コンポーネント */
export const OrderStatus: FC<OrderStatusProps> = ({ status, isReceived }) => {
  if (status === "cancelled") {
    return (
      <Badge variant="destructive" className="font-normal">
        キャンセル済み
      </Badge>
    );
  }

  if (isReceived) {
    return (
      <Badge variant="outline" className="font-normal">
        受け取り済み
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-green-600 font-normal">
      注文中
    </Badge>
  );
};
