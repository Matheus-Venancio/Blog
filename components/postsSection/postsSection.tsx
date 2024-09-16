import React, { cache } from "react";
import { getLandingPageEvents } from "@/api/firebase/eventPosts";
import { getLandingPagePosts } from "@/api/firebase/posts";
import CardNews from "../CardNews/CardNews";

export const getItem = cache(async (isEvent?: boolean) => {
  let newLatestPosts;
  if (isEvent) newLatestPosts = await getLandingPageEvents();
  else newLatestPosts = await getLandingPagePosts();
  return newLatestPosts;
});

export default async function PostsSection({ isEvent }: { isEvent?: boolean }) {
  const latestPosts = await getItem(isEvent);
  return (
    <div
      className={`flex flex-col md:flex-row ${
        isEvent ? "" : "-mt-28"
      } mb-12 space-y-8 md:space-y-0 md:space-x-5 lg:space-x-12 last:[&_a]:mr-0 items-center md:items-start`}
    >
      {latestPosts?.map((post, index) => (
        <CardNews key={index} post={post} isEvent={isEvent} />
      ))}
    </div>
  );
}
