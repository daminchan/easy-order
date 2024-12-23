/**
 * 配達スケジュール情報
 * @description 配達日と注文締切日時の情報を管理する
 */
export type DeliverySchedule = {
  /** 配達日 */
  deliveryDate: Date;
  /** 注文締切日時（2営業日前15時） */
  orderDeadline: Date;
};

/**
 * 指定された日付が営業日かどうかを判定する
 * @param date - 判定する日付
 * @returns 営業日の場合はtrue
 */
const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay();
  // 土曜(6)と日曜(0)は営業日ではない
  return day !== 0 && day !== 6;
};

/**
 * 指定された日付から指定された営業日数前の日付を取得する
 * @param date - 基準日
 * @param businessDays - 営業日数
 * @returns 指定された営業日数前の日付
 */
const getBusinessDaysBefore = (date: Date, businessDays: number): Date => {
  const result = new Date(date);
  let daysCount = 0;

  while (daysCount < businessDays) {
    result.setDate(result.getDate() - 1);
    if (isBusinessDay(result)) {
      daysCount++;
    }
  }

  return result;
};

/**
 * 今日から指定された日数分の配達可能日を取得する
 * @param days - 取得する日数（デフォルト: 14日）
 * @returns 配達可能日の配列
 */
export const getAvailableDeliveryDates = (days = 14): DeliverySchedule[] => {
  const schedules: DeliverySchedule[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 今日から指定日数分の日付をチェック
  for (let i = 0; i < days; i++) {
    const deliveryDate = new Date(today);
    deliveryDate.setDate(deliveryDate.getDate() + i);

    // 営業日のみ処理
    if (isBusinessDay(deliveryDate)) {
      // 締切日時を設定（2営業日前の15時）
      const deadline = getBusinessDaysBefore(deliveryDate, 2);
      deadline.setHours(15, 0, 0, 0);

      // 締切日時が未来の場合のみ追加
      if (deadline > new Date()) {
        schedules.push({
          deliveryDate,
          orderDeadline: deadline,
        });
      }
    }
  }

  return schedules;
};

/**
 * 指定された配達日が注文/キャンセル可能かチェックする
 * @param deliveryDate - チェックする配達日
 * @returns 注文/キャンセル可能な場合はtrue
 */
export const isWithinDeadline = (deliveryDate: Date): boolean => {
  const deadline = getBusinessDaysBefore(deliveryDate, 2);
  deadline.setHours(15, 0, 0, 0);
  return new Date() <= deadline;
};
