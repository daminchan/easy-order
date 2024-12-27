"use client";

import { type FC, useState, useMemo } from "react";
import {
  type AdminOrderGroup,
  type AdminOrderItem,
} from "@/lib/types/admin-order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfDay } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Printer, HelpCircle } from "lucide-react";
import { OrderListTitle } from "./_components/OrderListTitle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  /** 注文データ */
  orders: AdminOrderGroup[];
};

/** 印刷ページ */
export const PrintsPage: FC<Props> = ({ orders }) => {
  // 利用可能な日付の生成（予約された日付から取得）
  const availableDates = useMemo(() => {
    const dates = orders.map((order) => order.deliveryDate);
    const uniqueDates = Array.from(
      new Set(dates.map((date) => format(date, "yyyy-MM-dd")))
    ).map((dateStr) => new Date(dateStr));

    return uniqueDates.sort((a, b) => a.getTime() - b.getTime());
  }, [orders]);

  // 選択された日付（最も近い日付を初期値に）
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (availableDates.length > 0) {
      return availableDates[0];
    }
    return new Date();
  });

  // 選択された学年
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  // 商品カテゴリーのページ番号
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // 注文データの整理
  const processedOrders = useMemo(() => {
    // 選択された日付の注文のみフィルター
    const filteredOrders = orders.filter(
      (order) =>
        format(order.deliveryDate, "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );

    // 選択された学年でフィルター
    const gradeFiltered = selectedGrade
      ? filteredOrders.filter((order) => order.grade === selectedGrade)
      : filteredOrders;

    // 商品カテゴリーごとにグループ化
    const categorized = gradeFiltered.reduce((acc, order) => {
      if (!acc[order.productName]) {
        acc[order.productName] = {
          grade: order.grade,
          orders: [],
        };
      }
      acc[order.productName].orders.push(...order.orders);
      return acc;
    }, {} as Record<string, { grade: number; orders: AdminOrderItem[] }>);

    return {
      categories: Object.keys(categorized),
      ordersByCategory: categorized,
    };
  }, [orders, selectedDate, selectedGrade]);

  // 利用可能な学年の取得
  const availableGrades = useMemo(() => {
    const grades = new Set(orders.map((order) => order.grade));
    return Array.from(grades).sort();
  }, [orders]);

  // 印刷処理
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto py-8 space-y-8 print:p-0">
      {/* フィルターセクション */}
      <div className="flex items-center gap-4 print:hidden">
        <Select
          value={format(selectedDate, "yyyy-MM-dd")}
          onValueChange={(value) => setSelectedDate(new Date(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableDates.map((date) => (
              <SelectItem
                key={date.toISOString()}
                value={format(date, "yyyy-MM-dd")}
              >
                {format(date, "M月d日(E)", { locale: ja })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Badge
            variant="outline"
            className={`cursor-pointer ${
              !selectedGrade ? "bg-primary text-primary-foreground" : ""
            }`}
            onClick={() => setSelectedGrade(null)}
          >
            全学年
          </Badge>
          {availableGrades.map((grade) => (
            <Badge
              key={grade}
              variant="outline"
              className={`cursor-pointer ${
                selectedGrade === grade
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => setSelectedGrade(grade)}
            >
              {grade}年
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>印刷時のヘッダー・フッターを非表示にするには：</p>
                <ol className="list-decimal list-inside text-sm mt-2">
                  <li>印刷プレビューで「その他の設定」を開く</li>
                  <li>「ヘッダーとフッター」のチェックを外す</li>
                  <li>必要に応じて「余白」を「なし」に設定</li>
                </ol>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* カテゴリーページネーション */}
      {processedOrders.categories.length > 0 && (
        <div className="flex items-center justify-between print:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentCategoryIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentCategoryIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {processedOrders.categories[currentCategoryIndex]}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentCategoryIndex((prev) =>
                Math.min(processedOrders.categories.length - 1, prev + 1)
              )
            }
            disabled={
              currentCategoryIndex === processedOrders.categories.length - 1
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 注文テーブル */}
      <div className="print:m-8">
        <OrderListTitle
          date={selectedDate}
          grade={selectedGrade}
          category={processedOrders.categories[currentCategoryIndex]}
        />

        <Table>
          <TableHeader>
            <TableRow className="print:border-black [&>th]:py-4">
              <TableHead className="w-[200px] print:border-black">
                氏名
              </TableHead>
              <TableHead className="w-[150px] print:border-black">
                弁当名
              </TableHead>
              <TableHead className="w-[80px] text-center print:border-black">
                数量
              </TableHead>
              <TableHead className="w-[200px] print:border-black">
                備考
              </TableHead>
              <TableHead className="w-[80px] text-center print:border-black">
                受け取り
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedOrders.categories.length > 0 &&
              processedOrders.ordersByCategory[
                processedOrders.categories[currentCategoryIndex]
              ]?.orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="print:border-black [&>td]:py-4"
                >
                  <TableCell className="print:border-black">
                    {order.student.name}
                  </TableCell>
                  <TableCell className="print:border-black">
                    {processedOrders.categories[currentCategoryIndex]}
                  </TableCell>
                  <TableCell className="print:border-black text-center">
                    {order.quantity}
                  </TableCell>
                  <TableCell className="print:border-black">
                    {order.otherOrders}
                  </TableCell>
                  <TableCell className="print:border-black text-center">
                    <div className="h-5 w-5 border border-black mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
            /* ヘッダーとフッターを非表示にする */
            marks: none;
          }
          /* Chrome/Firefoxのヘッダー・フッター非表示 */
          html {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          body {
            font-size: 14px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          th,
          td {
            padding: 12px !important;
          }
          .print\\:border-black {
            border-color: #000 !important;
          }
          .print\\:m-8 {
            margin: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
