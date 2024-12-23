import { type FC } from "react";
import { OrdersPage } from "./OrdersPage";
import { getOrders } from "./_actions/getOrders";

/** 管理者用の注文一覧ページ */
const Page: FC = async () => {
  const { orders, dailySummary, error } = await getOrders();

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  return <OrdersPage orders={orders ?? []} dailySummary={dailySummary ?? []} />;
};

export default Page;
