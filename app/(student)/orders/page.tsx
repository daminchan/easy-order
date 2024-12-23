import { type FC } from "react";
import { OrdersPage } from "./OrdersPage";
import { getProducts } from "./_actions/getProducts";
import { getStudent } from "./_actions/getStudent";
import { getOrders } from "./_actions/getOrders";
import { auth } from "@clerk/nextjs/server";

/** 生徒の注文ページ */
const Page: FC = async () => {
  const { userId } = await auth();

  // デバッグ用：Clerkから取得したuserIdを確認
  console.log("Debug - Clerk userId:", userId);

  if (!userId) return null;

  // 商品データの取得
  const { products, error: productsError } = await getProducts();
  if (productsError) {
    return <div>エラーが発生しました</div>;
  }
  if (!products) {
    return <div>商品が見つかりませんでした</div>;
  }

  // 生徒データの取得
  const { student, error: studentError } = await getStudent(userId);
  // デバッグ用：生徒データの取得結果を確認
  console.log("Debug - Student data:", student);
  console.log("Debug - Student error:", studentError);

  if (studentError) {
    return <div>生徒情報の取得に失敗しました</div>;
  }
  if (!student) {
    return <div>生徒情報が見つかりませんでした</div>;
  }

  // 注文履歴の取得
  const { orders, error: ordersError } = await getOrders(student.id);
  if (ordersError) {
    return <div>注文履歴の取得に失敗しました</div>;
  }
  if (!orders) {
    return <div>注文履歴が見つかりませんでした</div>;
  }

  return <OrdersPage products={products} student={student} orders={orders} />;
};

export default Page;
