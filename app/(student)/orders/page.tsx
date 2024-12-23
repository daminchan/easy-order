import { type FC } from "react";
import { OrdersPage } from "./OrdersPage";
import { getProducts } from "./_actions/getProducts";
import { getStudent } from "./_actions/getStudent";
import { getOrders } from "./_actions/getOrders";
import { auth, currentUser } from "@clerk/nextjs/server";

/** 生徒の注文ページ */
const Page: FC = async () => {
  try {
    console.log("=== 注文ページ処理開始 ===");

    // Clerk認証情報の詳細を取得
    const { userId } = await auth();
    const user = await currentUser();
    console.log("Clerk認証情報:", {
      userId,
      userDetails: user
        ? {
            id: user.id,
            emailAddresses: user.emailAddresses,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
          }
        : null,
    });

    if (!userId) {
      console.log("ユーザーIDが取得できません");
      return null;
    }

    // 商品データの取得
    console.log("商品データ取得開始");
    const { products, error: productsError } = await getProducts();
    console.log("商品データ取得結果:", {
      success: !!products,
      error: productsError,
      productsCount: products?.length,
    });

    if (productsError) {
      console.error("商品データの取得エラー:", productsError);
      return <div>エラーが発生しました</div>;
    }
    if (!products) {
      console.log("商品が見つかりません");
      return <div>商品が見つかりませんでした</div>;
    }

    // 生徒データの取得
    console.log("=== 生徒情報取得開始 ===");
    const { student, error: studentError } = await getStudent(userId);
    console.log("生徒情報取得結果:", {
      success: !!student,
      error: studentError,
      studentData: student
        ? {
            id: student.id,
            grade: student.grade,
            className: student.className,
            name: student.name,
            isActive: student.isActive,
          }
        : null,
    });

    if (studentError) {
      console.error("生徒データの取得エラー:", studentError);
      return <div>生徒情報の取得に失敗しました</div>;
    }
    if (!student) {
      console.log("生徒情報が見つかりません");
      return <div>生徒情報が見つかりませんでした</div>;
    }

    // 注文履歴の取得
    console.log("注文履歴取得開始 - 生徒ID:", student.id);
    const { orders, error: ordersError } = await getOrders(student.id);
    console.log("注文履歴取得結果:", {
      success: !!orders,
      error: ordersError,
      ordersCount: orders?.length,
    });

    if (ordersError) {
      console.error("注文履歴の取得エラー:", ordersError);
      return <div>注文履歴の取得に失敗しました</div>;
    }
    if (!orders) {
      console.log("注文履歴が見つかりません");
      return <div>注文履歴が見つかりませんでした</div>;
    }

    console.log("=== 注文ページ処理完了 ===");
    return <OrdersPage products={products} student={student} orders={orders} />;
  } catch (error) {
    console.error("注文ページ全体のエラー:", error);
    return <div>予期せぬエラーが発生しました</div>;
  }
};

export default Page;
