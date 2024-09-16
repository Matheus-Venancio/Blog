"use client";
import React from "react";
import { Post } from "@/interfaces/postInterface";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { BlogCard } from "../blogCard/BlogCard";

export function BlogList({ posts }: { posts: Post[]; }) {
  return (
    <Grid2 container spacing={2} columnSpacing={{ xs: 2, md: 3, lg: 4 }}>
      {posts.map((post, index) => (
        <Grid2 key={index} sm={12} md={4}>
          {/* <BlogCardAlt post={post} /> */}
          <BlogCard post={post} />
        </Grid2>
      ))}
    </Grid2>
  );
}
