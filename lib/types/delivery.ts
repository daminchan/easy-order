/** 配達日 */
export type DeliveryDate = Date;

/** 注文締切日時 */
export type OrderDeadline = Date;

/** 配達可能日情報 */
export type AvailableDeliveryDate = {
  /** 配達日 */
  deliveryDate: DeliveryDate;
  /** 注文締切日時 */
  orderDeadline: OrderDeadline;
};
