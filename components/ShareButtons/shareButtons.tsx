"use client";

import { copyToClipboard } from "@/lib/utils";
import { Link } from "@mui/icons-material";
import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const blogUrl = "https://mblcampinas.org/blog/";

export default function ShareButtons({
  postId,
  isEventPost,
}: {
  postId: string;
  isEventPost?: boolean;
}) {
  const postUrl = isEventPost ? blogUrl + "event/" + postId : blogUrl + postId;
  return (
    <div className="flex">
      <FacebookShareButton url={postUrl}>
        <FacebookIcon className="w-10 h-10" />
      </FacebookShareButton>
      <WhatsappShareButton url={postUrl}>
        <WhatsappIcon className="w-10 h-10" />
      </WhatsappShareButton>
      <TelegramShareButton url={postUrl}>
        <TelegramIcon className="w-10 h-10" />
      </TelegramShareButton>
      <TwitterShareButton url={postUrl}>
        <div className="bg-gray-950 w-10 h-10 flex justify-center items-center">
          <img src="/twitter.svg" width={22} height={22} alt="Twitter" />
        </div>
      </TwitterShareButton>
      <div
        className="flex items-center justify-center w-10 h-10 bg-gray-500 cursor-pointer"
        onClick={() => copyToClipboard(postUrl)}
      >
        <Link sx={{ fill: "white" }} />
      </div>
    </div>
  );
}
