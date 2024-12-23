"use client";
import { type FC } from "react";

/** フッターコンポーネント */
export const Footer: FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            href="#"
            className="text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="sr-only">トップに戻る</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </a>
        </div>
        <div className="mt-4 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} EazyOrder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
