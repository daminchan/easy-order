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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

type Props = {
  /** 注文データ */
  orders: AdminOrderGroup[];
};

/** 印刷ページ */
export const PrintsPage: FC<Props> = ({ orders }) => {
  // 利用可能な日付の生成（今日から7日分）
  const availableDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) =>
      addDays(startOfDay(new Date()), i)
    );
  }, []);

  // 選択された日付
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

    return {
      categories: Array.from(
        new Set(gradeFiltered.map((order) => order.productName))
      ),
      ordersByCategory: gradeFiltered.reduce((acc, order) => {
        if (!acc[order.productName]) {
          acc[order.productName] = [];
        }
        acc[order.productName].push(...order.orders);
        return acc;
      }, {} as Record<string, AdminOrderItem[]>),
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

        <Button variant="outline" size="icon" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
        </Button>
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
      <Card className="print:shadow-none">
        <CardHeader className="print:pb-2">
          <CardTitle>
            {format(selectedDate, "M月d日(E)", { locale: ja })}の注文一覧
            {selectedGrade && ` - ${selectedGrade}年生`}
            {processedOrders.categories.length > 0 &&
              ` - ${processedOrders.categories[currentCategoryIndex]}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="print:border-black">
                <TableHead className="print:border-black">クラス</TableHead>
                <TableHead className="print:border-black">氏名</TableHead>
                <TableHead className="print:border-black text-center">
                  数量
                </TableHead>
                <TableHead className="print:border-black">備考</TableHead>
                <TableHead className="print:border-black text-right">
                  受け取り
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedOrders.categories.length > 0 &&
                processedOrders.ordersByCategory[
                  processedOrders.categories[currentCategoryIndex]
                ]?.map((order) => (
                  <TableRow key={order.id} className="print:border-black">
                    <TableCell className="print:border-black">
                      {order.student.className}
                    </TableCell>
                    <TableCell className="print:border-black">
                      {order.student.name}
                    </TableCell>
                    <TableCell className="print:border-black text-center">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="print:border-black">
                      {order.otherOrders}
                    </TableCell>
                    <TableCell className="print:border-black text-right">
                      <Checkbox
                        checked={order.isReceived}
                        className="print:border-black"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            font-size: 12px;
          }
          th,
          td {
            padding: 8px !important;
          }
          .print\\:border-black {
            border-color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
};
