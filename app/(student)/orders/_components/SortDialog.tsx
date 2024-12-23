"use client";

import { type FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

type SortOption = {
  id: string;
  label: string;
  value: "date" | "price" | "name" | "favorite";
};

const sortOptions: SortOption[] = [
  { id: "1", label: "お気に入り優先", value: "favorite" },
  { id: "2", label: "日付順", value: "date" },
  { id: "3", label: "価格順", value: "price" },
  { id: "4", label: "名前順", value: "name" },
];

type Props = {
  /** 選択中のソート条件 */
  selectedSort: SortOption["value"];
  /** ソート条件変更時のコールバック */
  onSortChange: (value: SortOption["value"]) => void;
};

/** ソート条件選択ダイアログ */
export const SortDialog: FC<Props> = ({ selectedSort, onSortChange }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          並び替え
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>並び替え条件を選択</DialogTitle>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 pt-4">
          {sortOptions.map((option) => (
            <Badge
              key={option.id}
              variant={selectedSort === option.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => {
                onSortChange(option.value);
                handleClose();
              }}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
