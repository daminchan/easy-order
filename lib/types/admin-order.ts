/** 管理者用の注文グループ */
export type AdminOrderGroup = {
  /** 学年 */
  grade: number;
  /** 商品名 */
  productName: string;
  /** 配達日 */
  deliveryDate: Date;
  /** 注文一覧 */
  orders: AdminOrderItem[];
};

/** 管理者用の注文アイテム */
export type AdminOrderItem = {
  /** 注文ID */
  id: string;
  /** 生徒情報 */
  student: {
    /** クラス */
    className: string;
    /** 生徒名 */
    name: string;
  };
  /** 注文数 */
  quantity: number;
  /** 他の注文情報 */
  otherOrders?: string;
  /** 受け取り状態 */
  isReceived: boolean;
  /** 配達日 */
  deliveryDate: Date;
};
