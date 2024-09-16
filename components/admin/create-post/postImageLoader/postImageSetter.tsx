"use client";

import { storage } from "@/api/firebase/initialConfig";
import { Check, ContentCopy } from "@mui/icons-material";
import { Alert } from "@mui/material";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  Tooltip,
} from "@nextui-org/react";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";

interface PostImage {
  name: string;
  url: string;
  isCover: boolean;
}

export default function PostImageSetter({
  onCoverSet,
  refresh,
  onFinishRefresh,
}: {
  onCoverSet: (coverUrl: string) => void;
  refresh: boolean;
  onFinishRefresh: () => void;
}) {
  const [imageList, setImageList] = useState<PostImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function copyImageUrl(imageUrl: string) {
    navigator.clipboard.writeText(imageUrl).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  function setAsCover(imageId: number) {
    if (imageList[imageId].isCover) {
      return;
    }

    const newImageList = [...imageList];

    const prevCoverId = newImageList.findIndex((image) => image.isCover);

    if (prevCoverId !== -1) {
      newImageList[prevCoverId].isCover = false;
    }

    newImageList[imageId].isCover = true;

    onCoverSet(newImageList[imageId].url);

    setImageList(newImageList);
  }

  async function getImages() {
    const myImages: PostImage[] = [];
    // Create a reference under which you want to list
    const listRef = ref(storage, "blog");

    // Find all the prefixes and items.
    await listAll(listRef)
      .then(async (res) => {
        for (const itemRef of res.items) {
          const imageUrl = await getDownloadURL(itemRef);
          const myImage: PostImage = {
            name: itemRef.name,
            url: imageUrl,
            isCover: false,
          };

          myImages.push(myImage);
        }
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      })
      .finally(() => {
        setIsLoading(false);
        onFinishRefresh();
      });

    setImageList(myImages);
  }

  useEffect(() => {
    if (refresh) {
      getImages();
    }
  }, [refresh, onFinishRefresh]);

  return (
    <div>
      <h1 className="mb-2">Galeria</h1>
      <Alert className="my-2" severity="info">
        A galeria é compartilhada entre todos os administradores
      </Alert>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <div className="flex flex-wrap max-h-80 overflow-y-auto [&_div]:mr-3 [&_div]:mb-2 [&_label]:mb-2">
          {imageList.map((image, index) => (
            <Card key={index} className="w-fit">
              <CardHeader className="justify-between">
                <h2 className="w-40 text-ellipsis line-clamp-1 hover:line-clamp-3">
                  {image.name}
                </h2>
                <div>
                  <Tooltip content="Definir como capa">
                    <Button
                      isIconOnly
                      size="sm"
                      color={image.isCover ? "success" : "default"}
                      onPress={() => setAsCover(index)}
                    >
                      <Check fontSize="small" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Copiar link">
                    <Button
                      className="ml-1"
                      isIconOnly
                      size="sm"
                      color="primary"
                      onPress={() => copyImageUrl(image.url)}
                    >
                      <ContentCopy fontSize="small" />
                    </Button>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pb-0">
                <img src={image.url} alt="Imagem" className="w-52 h-32" />
                <a href={image.url} target="_blank" rel="noreferrer">
                  Abrir em nova guia
                </a>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
