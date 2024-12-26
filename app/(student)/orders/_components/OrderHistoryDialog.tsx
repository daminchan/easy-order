// /**
//  * 注文履歴を表示するダイアログ
//  * @description
//  * - 過去の注文履歴をモーダルで表示
//  * - 注文のキャンセルや受け取り確認などの操作が可能
//  * - 商品一覧画面からアクセス可能
//  */
// "use client";

// import { type FC } from "react";
// import { type OrderHistoryItem } from "@/lib/types/order";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { OrderHistory } from "./OrderHistory";
// import { History } from "lucide-react";

// type Props = {
//   /** 注文履歴リスト */
//   orders: OrderHistoryItem[];
//   /** キャンセル処理 */
//   onCancel: (orderId: string) => Promise<void>;
//   /** 受け取り処理 */
//   onReceive: (orderId: string) => Promise<void>;
// };

// /** 注文履歴ダイアログ */
// export const OrderHistoryDialog: FC<Props> = ({
//   orders,
//   onCancel,
//   onReceive,
// }) => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm" className="gap-2">
//           <History className="h-4 w-4" />
//           注文履歴
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>注文履歴</DialogTitle>
//         </DialogHeader>
//         <div className="mt-4">
//           <OrderHistory
//             orders={orders}
//             onCancel={onCancel}
//             onReceive={onReceive}
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
