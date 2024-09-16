import React from "react";
import { formatBytes } from "@/helpers/formatBytes";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function FileCard({
  name,
  size,
  handleRemove,
  imgSrc,
}: {
  name?: string;
  size?: number;
  imgSrc?: string;
  handleRemove: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-0 justify-between">
        <div className="flex flex-col">
          <h3 className="w-40 text-ellipsis line-clamp-1 hover:line-clamp-3">{name}</h3>
          <p className="text-sm">{formatBytes(size)}</p>
        </div>
        <IconButton onClick={handleRemove}>
          <DeleteIcon color="error" fontSize="small" />
        </IconButton>
      </CardHeader>
      <CardBody className="pt-0">
        <img src={imgSrc} alt="post image" className="w-52 h-32" />
      </CardBody>
    </Card>
  );
}
