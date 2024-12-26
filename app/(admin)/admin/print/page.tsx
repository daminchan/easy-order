import { type FC } from "react";
import { PrintsPage } from "./PrintsPage";
import { getPrintOrders } from "./_actions/getPrintOrders";

/**
 * 印刷ページ
 */
const Page: FC = async () => {
  const { orders, error } = await getPrintOrders();

  if (error) {
    return <div>エラーが発生しました: {error}</div>;
  }

  return <PrintsPage orders={orders ?? []} />;
};

export default Page;
