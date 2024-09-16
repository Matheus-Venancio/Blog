import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./blogPost.module.css";
import dayjs from "dayjs";
import { getEventPost } from "@/api/firebase/eventPosts";
import ShareButtons from "@/components/ShareButtons/shareButtons";
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
  const res = await getEventPost(id);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const postData = await getData(params.id);

  return (
    <div className={styles.container}>
      <article className={styles.article}>
        <h1>{postData.title}</h1>
        <h2 className={styles.subtitle}>{postData.subtitle}</h2>
        <div className="my-2">
          <address>
            <p>Por {postData.author}</p>
          </address>
          <time
            dateTime={dayjs(postData.pubDate * 1000).format("YYYY-MM-DD HH:mm")}
          >
            <p>
              {dayjs(postData.pubDate * 1000).format("DD/MM/YYYY")} |{" "}
              {dayjs(postData.pubDate * 1000).format("HH:mm")}
            </p>
          </time>
        </div>
        <ShareButtons postId={params.id} isEventPost />
        <hr style={{ marginBlock: "20px" }} />
        <ReactMarkdown>{postData.article}</ReactMarkdown>
      </article>
    </div>
  );
}
