"use client";

import React, { useEffect, useState } from "react";
import { Post } from "@/interfaces/postInterface";
import { getPostsList } from "@/api/firebase/posts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Input } from "@nextui-org/react";
import styles from "./blog.module.css";
import { BlogList } from "../../components/blog/blogList/BlogList";

dayjs.locale("pt-br");

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPostList() {
      const futurePosts = await getPostsList();

      if (futurePosts && futurePosts.length > 0) {
        setPosts(futurePosts);
      }
    }

    fetchPostList();
  }, []);

  return (
    <div>
      <div className={styles.bgContainer}>
        <div className="absolute z-10 w-full h-full bg-gradient-to-t opacity-60 from-black to-gray-500" />
        <h1 className="absolute text-8xl text-gray-100 mb-3 z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Blog
        </h1>
        <div className={styles.blogBg} />
        <div className={styles.blogBg2} />
      </div>
      <div className="relative p-5 flex justify-center items-center w-full h-28 bg-[url('/landing_page_art.png')] bg-center bg-cover">
        <div className="absolute w-full h-full bg-yellow-300" />
        <Input
          classNames={{
            base: "max-w-full sm:max-w-sm h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Digite para buscar..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
      </div>
      <div className="p-2 py-8 sm:p-3 sm:pt-8 m-auto max-w-5xl ">
        <BlogList posts={posts} />
      </div>
    </div>
  );
}

const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={height || size}
    role="presentation"
    viewBox="0 0 24 24"
    width={width || size}
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
