import { type Product } from "../types/product";

/** モック商品データ */
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "ハンバーグ定食",
    price: 800,
    available: true,
    description: "ジューシーな手作りハンバーグに季節の野菜を添えて",
    imageUrl: "/images/menu/sample1.jpeg",
  },
  {
    id: "2",
    name: "唐揚げ定食",
    price: 750,
    available: true,
    description: "カラッと揚がった国産鶏の唐揚げ",
    imageUrl: "/images/menu/sample1.jpeg",
  },
  {
    id: "3",
    name: "サーモン丼",
    price: 900,
    available: true,
    description: "新鮮なサーモンをたっぷりと",
    imageUrl: "/images/menu/sample1.jpeg",
  },
  {
    id: "4",
    name: "野菜たっぷりサラダうどん",
    price: 680,
    available: true,
    description: "季節の野菜をふんだんに使用した冷やしうどん",
    imageUrl: "/images/menu/sample1.jpeg",
  },
  {
    id: "5",
    name: "カレーライス",
    price: 700,
    available: false,
    description: "秘伝のスパイスで仕上げた特製カレー",
    imageUrl: "/images/menu/sample1.jpeg",
  },
];
