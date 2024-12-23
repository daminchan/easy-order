"use client";

import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, GraduationCap, Package2, Filter } from "lucide-react";

type Filter = {
  grade?: number;
  productName?: string;
};

type Props = {
  /** 利用可能な学年一覧 */
  grades: number[];
  /** 利用可能な商品名一覧 */
  productNames: string[];
  /** 現在のフィルター */
  currentFilter: Filter;
  /** フィルター変更時のコールバック */
  onFilterChange: (filter: Filter) => void;
};

/**
 * フィルタータブ
 * @description 注文一覧のフィルタリングを行うタブコンポーネント
 */
export const FilterTabs: FC<Props> = ({
  grades,
  productNames,
  currentFilter,
  onFilterChange,
}) => {
  /** 学年フィルターの切り替え */
  const handleGradeClick = (grade: number) => {
    if (currentFilter.grade === grade) {
      onFilterChange({ ...currentFilter, grade: undefined });
    } else {
      onFilterChange({ ...currentFilter, grade });
    }
  };

  /** 商品フィルターの切り替え */
  const handleProductClick = (productName: string) => {
    if (currentFilter.productName === productName) {
      onFilterChange({ ...currentFilter, productName: undefined });
    } else {
      onFilterChange({ ...currentFilter, productName });
    }
  };

  /** フィルタ���のクリア */
  const handleClearFilter = () => {
    onFilterChange({});
  };

  const hasActiveFilter =
    currentFilter.grade !== undefined ||
    currentFilter.productName !== undefined;

  return (
    <div className="w-full">
      {/* フィルターヘッダー */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">絞り込み</h2>
        </div>
        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            クリア
          </Button>
        )}
      </div>

      {/* フィルターコンテンツ */}
      <div className="grid gap-6 md:grid-cols-2 pt-6">
        {/* 学年フィルター */}
        <Card className="border-2 border-muted shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 pb-4 border-b">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-700">学年で絞り込み</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {grades.map((grade) => (
                <Button
                  key={grade}
                  variant={
                    currentFilter.grade === grade ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleGradeClick(grade)}
                  className={`h-9 min-w-[4rem] ${
                    currentFilter.grade === grade
                      ? "bg-green-600 hover:bg-green-700 shadow-sm"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {grade}年
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 商品フィルター */}
        <Card className="border-2 border-muted shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Package2 className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-700">商品で絞り込み</h3>
            </div>
            <ScrollArea className="h-[120px] pt-4 px-1">
              <div className="grid grid-cols-2 gap-2">
                {productNames.map((name) => (
                  <Button
                    key={name}
                    variant={
                      currentFilter.productName === name ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleProductClick(name)}
                    className={`h-9 w-full ${
                      currentFilter.productName === name
                        ? "bg-green-600 hover:bg-green-700 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{name}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
