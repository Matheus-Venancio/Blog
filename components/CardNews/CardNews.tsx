import React from "react";
import Link from "next/link";
import { Post } from "@/interfaces/postInterface";
import styles from "./CardNews.module.css";
import { Avatar } from "@nextui-org/react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { estimateReadingTime } from "@/helpers/readingTime";
dayjs.locale("pt-br");

export default function CardNews({
  post,
  isEvent,
}: {
  post: Post;
  isEvent?: boolean;
}) {
  const url = isEvent ? `/blog/event/${post.id}` : `/blog/${post.id}`;
  return (
    <Link className="z-10 w-full md:w-[320px] h-max" href={url}>
      <div className="overflow-clip">
        <img src={post.coverUrl} alt="newsImage" className={styles.imageGrow} />
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
