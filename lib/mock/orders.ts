import { type OrderHistoryItem } from "../types/order";

/** モック注文履歴データ */
export const mockOrders: OrderHistoryItem[] = [
  {
    id: "order1",
    orderDate: new Date("2023-12-16T10:30:00"),
    deliveryDate: new Date("2023-12-18T11:30:00"),
    status: "active",
    details: [
      {
        id: "detail1",
        productName: "ハンバーグ定食",
        price: 800,
        quantity: 1,
        imageUrl: "/images/menu/sample1.jpeg",
      },
      {
        id: "detail2",
        productName: "唐揚げ定食",
        price: 750,
        quantity: 2,
        imageUrl: "/images/menu/sample1.jpeg",
      },
    ],
    totalAmount: 2300,
  },
  {
    id: "order2",
    orderDate: new Date("2023-12-15T12:45:00"),
    deliveryDate: new Date("2023-12-17T11:30:00"),
    status: "cancelled",
    details: [
      {
        id: "detail3",
        productName: "サーモン丼",
        price: 900,
        quantity: 1,
        imageUrl: "/images/menu/sample1.jpeg",
      },
    ],
    totalAmount: 900,
  },
  {
    id: "order3",
    orderDate: new Date("2023-12-14T11:15:00"),
    deliveryDate: new Date("2023-12-16T11:30:00"),
    status: "active",
    details: [
      {
        id: "detail4",
        productName: "野菜たっぷりサラダうどん",
        price: 680,
        quantity: 1,
        imageUrl: "/images/menu/sample1.jpeg",
      },
    ],
    totalAmount: 680,
  },
];
