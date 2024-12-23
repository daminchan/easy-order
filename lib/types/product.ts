/** 商品情報 */
export type Product = {
  /** 商品ID */
  id: string;
  /** 商品名 */
  name: string;
  /** 価格 */
  price: number;
  /** 注文受付可能か */
  available: boolean;
  /** 商品画像のURL（任意） */
  imageUrl?: string;
  /** 商品の説明（任意） */
  description?: string;
  /** 商品の表示順序 */
  displayOrder: number;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};

/** 商品一覧の表示用データ */
export type ProductListItem = Product & {
  /** 注文済みかどうか */
  isOrdered: boolean;
};
