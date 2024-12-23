# 開発ガイドライン

## 目次

1. [実装背景](#実装背景)
2. [プロジェクト構成](#プロジェクト構成)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [コンポーネントの配置ルール](#コンポーネントの配置ルール)
5. [命名規則](#命名規則)

## 実装背景

### 現状の運用（As-Is）

- 学生に 2 日後の注文用紙を配布し、食べたい商品を記入してもらう
- 飲食店で集計して作る商品をまとめる
- 集計した内容から商品ごとのチェックリストを手作業で作成
- 商品受け渡し時にチェックリストを使用して管理

### 改善したい点

- 注文用紙の配布・回収の手間を削減
- 集計作業の自動化
- チェックリストの自動生成

### 維持する要素

- 紙媒体のチェックリストは継続使用
- お金の受け渡しとチェックは直接対応
- 商品ごとにチェックリストを分けて管理
- 学年別の管理

### システム要件

#### 注文システム

- 注文締め切り：提供日の 2 日前の 15 時まで
- 生徒は事前に ���� 文用紙を入れる
- 同じ生徒が複数商品を注文可能

#### チェックリスト出力

- 商品ごとに分けたリストを出力
- 学年ごとに区分け
- 出力フォーマット：

```
出力イメージ:
かつ丼の1学年用チェックリスト（1枚目）
『かつ丼』
1学年
名前    個数   支払金額   チェック欄   備考
A君     1個    500円     □          他の注文：カラアゲ弁当
B君     2個    1000円    □

合計: 3個（1,500円）

かつ丼の2学年用チェックリスト（2枚目）
『かつ丼』
2学年
名前    個数   支払金額   チェック欄   備考
C君     1個    500円     □          他の注文：カラアゲ弁当
D君     2個    1000円    □

合計: 3個（1,500円）


カラアゲ弁当の1学年用チェックリスト（3枚目）
『カラアゲ弁当』
1学年
名前    個数   支払金額   チェック欄   備考
A君     1個    450円     □          他の注文：かつ丼
E君     2個    900円     □

合計: 3個（1,350円）

## プロジェクト構成

使用技術スタック：

- Next.js 15 (App Router)
- TypeScript
- Prisma (ORM)
- Supabase (データベース)
- Clerk (認証)
- shadcn/ui (UI コンポーネント)
- Zod (バリデーション)

## ディレクトリ構造

```

easy-order/
├── app/
│ ├── (auth)/ # 認証関連ページ
│ │ ├── sign-in/
│ │ └── sign-up/
│ ├── (admin)/ # 管理者用機能
│ │ ├── students/ # 生徒管理
│ │ ├── products/ # 商品管理
│ │ └── orders/ # 注文管理・チェックリスト
│ ├── (student)/ # 生徒用機能
│ │ ├── menu/ # メニュー一覧・詳細
│ │ │ ├── [id]/ # メニュー詳細
│ │ │ └── page.tsx # メニュー一覧
│ │ └── orders/ # 注文履歴
│ ├── \_components/ # 共通コンポーネント
│ └── page.tsx # トップページ
├── components/ # コンポーネント
│ └── features/ # 機能別コンポーネント
│ ├── auth/ # 認証関連
│ ├── order/ # 注文関連
│ └── product/ # 商品関連
└── lib/ # ユーティリティ
├── types/ # 型定義
├── hooks/ # カスタムフック
└── utils/ # 汎用関数

````

## コンポーネントの配置ルール

### app/\_components/

- ページ固有のコンポーネントを配置
- 他のページからの意図しない import を防止

### features/

- 再利用可能なコンポーネントを配置
- ドメイン知識の有無で分類

## 命名規則

### ファイル名

- コンポーネント: `PascalCase.tsx`
- ユーティリティ: `camelCase.ts`
- 型定義: `types.ts`

### コンポーネント構造

- 子コンポーネントの使用範囲を 1 つ上の階層の親に限定
- index.ts ファイルのリレー構造で制御

### Page コンポーネント

- `page.tsx`はサーバーコンポーネントとして実装
- 実際の実装は`〇〇〇〇Page.tsx`としてクライアントコンポーネントで作成

## データモデル

### テーブル構造

#### Student（生徒）

```typescript
type Student = {
  /** システム内部ID */
  id: string;
  /** Clerk認証ID */
  clerkId: string;
  /** ログインID（学籍番号） */
  loginId: string;
  /** 生徒名 */
  name: string;
  /** 学年 */
  grade: number;
  /** アカウント状態 */
  isActive: boolean;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};
````

#### Product（商品）

```typescript
type Product = {
  /** 商品ID */
  id: string;
  /** 商品名 */
  name: string;
  /** 価格 */
  price: number;
  /** 注文受付可能か */
  available: boolean;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
};
```

#### Order（注文）

```typescript
type Order = {
  /** 注文ID */
  id: string;
  /** 生徒ID */
  studentId: string;
  /** 合計金額 */
  totalAmount: number;
  /** 注文状態 */
  status: OrderStatus;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
  /** 注文詳細 */
  orderDetails: OrderDetail[];
};
```

#### OrderDetail（注文詳細）

```typescript
type OrderDetail = {
  /** 注文詳細ID */
  id: string;
  /** 注文ID */
  orderId: string;
  /** 商品ID */
  productId: string;
  /** 数量 */
  quantity: number;
  /** 注文時の価格 */
  price: number;
};
```

### 定数定義

```typescript
// 注文ステータス
export const ORDER_STATUS = {
  ACTIVE: "active",
  CANCELLED: "cancelled",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// ルート定義
export const ROUTES = {
  STUDENT: {
    ORDERS: "/orders",
    HISTORY: "/orders/history",
  },
  ADMIN: {
    STUDENTS: "/admin/students",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
  },
} as const;
```

### バリデーションスキーマ

```typescript
// 注文バリデーション
export const orderDetailSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

export const orderSchema = z.object({
  orderDetails: z.array(orderDetailSchema).min(1),
});

// 生徒バリデーション
export const studentSchema = z.object({
  loginId: z.string().min(1),
  name: z.string().min(1),
  grade: z.number().min(1).max(3),
  isActive: z.boolean(),
});
```

## 機能仕様

### 管理者機能

- 生徒の登録・管理
- 商品の管理
- 注文の集計
- チェックリストの出力

### 生徒機能

- ログイン/ログアウト
- 商品の注文
- 注文のキャンセル
- 注文履歴の確認

### 出力機能

- 商品別のチェックリスト
- 学年別に色分け
- 備考欄に他の注文情報を表示

### 注文フロー

1. 生徒がログイン
2. 商品を選択して注文
3. 注文データの作成

   ```typescript
   // 注文データ
   const newOrder = {
     id: "uuid-xxx",
     studentId: "ログイン中の生徒のID",
     totalAmount: 1550,
     status: "active",
   };

   // 注文詳細データ
   const orderDetails = [
     {
       id: "uuid-yyy",
       orderId: "uuid-xxx",
       productId: "かつ丼のID",
       quantity: 1,
       price: 800,
     },
   ];
   ```

4. 注文履歴への反映
5. 管理者用チェックリストへの反映

## データベース設計

```prisma
model Student {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  loginId   String   @unique
  name      String
  grade     Int
  isActive  Boolean  @default(true)
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id            String        @id @default(cuid())
  name          String
  price         Int
  available     Boolean       @default(true)
  orderDetails  OrderDetail[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Order {
  id           String        @id @default(cuid())
  student      Student       @relation(fields: [studentId], references: [id])
  studentId    String
  totalAmount  Int
  status       String
  orderDetails OrderDetail[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model OrderDetail {
  id        String   @id @default(cuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Int
}
```

## コンポーネントの型定義パターン

### 基本構造

```
ComponentName/
├── ComponentName.tsx  # メインのコンポーネント実装
└── index.ts          # エクスポート定義
```

### 1. ページコンポーネント

```typescript
// page.tsx（サーバーコンポーネント）
import { type FC } from "react";
import { SomePage } from "./SomePage";

const Page: FC = () => {
  return <SomePage />;
};

export default Page;

// SomePage.tsx（クライアントコンポーネント）
("use client");
import { type FC, type ComponentProps } from "react";
import { ChildComponent } from "./_components/ChildComponent";

/** 子コンポーネントの型を親で定義 */
type ChildComponentProps = ComponentProps<typeof ChildComponent>;

/** ページの実装 */
export const SomePage: FC = () => {
  /** イベントハンドラは子コンポーネントの型から抽出 */
  const handleAction: ChildComponentProps["onAction"] = async (input) => {
    // 処理の実装
  };

  return <ChildComponent data={[]} onAction={handleAction} />;
};
```

### 2. 子コンポーネント

```typescript
"use client";
import { type FC } from "react";

/** Propsの型定義 */
type Props = {
  /** データの説明 */
  data: SomeType[];
  /** アクション実行時の処理の説明 */
  onAction: (input: InputType) => Promise<void>;
};

/** コンポーネントの説明 */
export const ChildComponent: FC<Props> = ({ data, onAction }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // フォームデータから直接値を取得して処理
        onAction({
          value: formData.get("field") as string,
        });
      }}
    >
      {/* JSXの実装 */}
    </form>
  );
};
```

### 実装のポイント

1. **型定義**

   - `type`を使用し、`interface`は使用しない
   - 全ての Props とその項目に JSDoc コメントを付ける
   - `ComponentProps`を使用して子コンポーネントの型を親で定義

2. **イベントハンドラ**

   - `handle****`という関数を作成せず、要素に直接定義
   - フォームの場合は`FormData`を使用して値を取得

3. **コンポーネントの分割**

   - ページコンポーネントは`page.tsx`と実装用の`〇〇〇〇Page.tsx`に分ける
   - 子コンポーネントは`_components`ディレクトリに配置
   - クライアントコンポーネントには`'use client'`ディレクティブを付ける

4. **エクスポート**

   - 名前付きエクスポートを使用
   - `index.ts`でリレー形式のエクスポートを行う

5. **型安全性**

   - `any`や型キャストを避ける
   - 必要な場合は型ガードを使用

6. **コンポーネントの責務**
   - 親コンポーネントでデータの取得とイベントハンドラの定義
   - 子コンポーネントは UI の表示とユーザー入力の処理に専念

これらの規則に従うことで、一貫性のある型安全なコンポーネントを実装できます。
