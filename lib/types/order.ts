/** 注文商品情報 */
type OrderProduct = {
  /** 商品ID */
  id: string;
  /** 商品名 */
  name: string;
  /** 価格 */
  price: number;
  /** 商品画像のURL（任意） */
  imageUrl?: string;
};

/** 注文アイテム情報 */
type OrderItem = {
  /** 商品情報 */
  product: OrderProduct;
  /** 数量 */
  quantity: number;
  /** 注文時の価格 */
  price: number;
};

/** 注文情報 */
export type Order = {
  /** 注文ID */
  id: string;
  /** 配達日 */
  deliveryDate: Date;
  /** 注文ステータス */
  status: string;
  /** 受け取り状態 */
  isReceived: boolean;
  /** 合計金額 */
  totalAmount: number;
  /** 注文アイテム */
  items: OrderItem[];
  /** 注文日時 */
  createdAt: Date;
};

/** 注文詳細情報 */
export type OrderDetail = {
  /** 注文詳細ID */
  id: string;
  /** 商品名 */
  productName: string;
  /** 商品画像のURL（任意） */
  imageUrl?: string;
  /** 価格 */
  price: number;
  /** 数量 */
  quantity: number;
};

/** 注文状態 */
export const ORDER_STATUS = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** 注文フォームの入力値 */
export type OrderFormInput = {
  /** 配達日 */
  deliveryDate: Date;
  /** 商品ごとの注文情報 */
  items: {
    /** 商品ID */
    productId: string;
    /** 数量 */
    quantity: number;
  }[];
};

/** 注文履歴の表示用データ */
export type OrderHistoryItem = {
  /** 注文ID */
  id: string;
  /** 注文日時 */
  orderDate: Date;
  /** 提供日 */
  deliveryDate: Date;
  /** 注文状態 */
  status: "active" | "cancelled";
  /** 受け取り状態 */
  isReceived: boolean;
  /** 注文詳細 */
  details: OrderDetail[];
  /** 合計金額 */
  totalAmount: number;
};
