/** 注文に関する定数 */
export const ORDER_CONSTANTS = {
  /** 表示する注文履歴の最大件数 */
  MAX_HISTORY_ITEMS: 3,
  /** キャンセル期限（配達日からの日数） */
  CANCEL_DEADLINE_DAYS: 2,
  /** キャンセル期限の時刻（時） */
  CANCEL_DEADLINE_HOUR: 15,
  /** キャンセル期限の時刻（分） */
  CANCEL_DEADLINE_MINUTE: 0,
} as const;
