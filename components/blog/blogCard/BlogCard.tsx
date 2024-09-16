"use client";
import React from "react";
import { Post } from "@/interfaces/postInterface";
import dayjs from "dayjs";
import { Avatar } from "@nextui-org/react";
import { estimateReadingTime } from "@/helpers/readingTime";
import Link from "next/link";

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.id}`} className="mb-5 hover:cursor-pointer">
      <div className="w-full lg:max-w-md h-auto lg:h-48 overflow-y-clip">
        <img
          className="h-auto max-h-96 lg:h-48 w-full object-cover object-center"
          alt={post.title}
          src={post.coverUrl}
        />
      </div>
      <div className="flex-col my-2">
        <h3
          className="text-2xl mb-2 font-bold"
          style={{ fontFamily: "var(--font-pt-serif)" }}
        >
          {post.title}
        </h3>
        <h4 className="text-md text-ellipsis line-clamp-4">{post.subtitle}</h4>
      </div>
      <div className="flex items-center">
        <Avatar size="md" name={post.author} />
        <div className="flex-col ml-2">
          <h4 className="text-md">{post.author}</h4>
          <h5 className="text-sm">
            {dayjs(post.pubDate * 1000).format("DD MMM")} •{" "}
            {estimateReadingTime(post.article)}{" "}
          </h5>
        </div>
      </div>
    </Link>
  );
}
