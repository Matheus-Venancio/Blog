import React from "react";
import ReactMarkdown from "react-markdown";
import { getPost } from "@/api/firebase/posts";
import dayjs from "dayjs";
import rehypeRaw from "rehype-raw";
import InstagramFeed from "@/components/InstagramFeed/InstagramFeed";

import styles from "./blogPost.module.css";
import ShareButtons from "@/components/ShareButtons/shareButtons";
import { estimateReadingTime } from "@/helpers/readingTime";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const post = await getData(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.subtitle || "",
    openGraph: {
      images: [post.coverUrl, ...previousImages],
    },
  };
}

async function getData(id: string) {
  const res = await getPost(id);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    // TODO: Implement error page
    throw new Error("Failed to fetch data");
  }

  return res;
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const postData = await getData(params.id);

  return (
    <div className="pb-[80px] px-2 sm:px-8">
      <article className={styles.article}>
        <h1 style={{ fontFamily: "var(--font-pt-serif)", fontWeight: "bold" }}>
          {postData.title}
        </h1>
        <h2 className={styles.subtitle}>{postData.subtitle}</h2>
        <div className="my-2">
          <address>
            <p>Por {postData.author}</p>
          </address>
          <div className="flex">
            <time
              dateTime={dayjs(postData.pubDate * 1000).format(
                "YYYY-MM-DD HH:mm"
              )}
            >
              <p>
                {dayjs(postData.pubDate * 1000).format("DD/MM/YYYY")} |{" "}
                {dayjs(postData.pubDate * 1000).format("HH:mm")}
              </p>
            </time>
            <span className="ml-2">
              • {estimateReadingTime(postData.article)} leitura
            </span>
          </div>
        </div>
        <ShareButtons postId={params.id} />
        <hr style={{ marginBlock: "20px" }} />
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {postData.article}
        </ReactMarkdown>
        <InstagramFeed />
      </article>
    </div>
  );
}
