/**
 * @description トップページ
 * @note
 * - FCを明示的にimportして使用
 * - Pageコンポーネントとして定義
 */
import { type FC } from "react";
import { Hero } from "@/components/features/home/Hero";

const Page: FC = () => {
  return <Hero />;
};

export default Page;
