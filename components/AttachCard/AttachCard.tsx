"use client";

import React from "react";
import { Button } from "@mui/material";
import { AttachFile } from "@mui/icons-material";

export default function AttachCard({
  onChange,
  customIcon,
}: {
  onChange: ([]) => void;
  customIcon?: React.ReactNode;
}) {
  return (
    <Button className="w-36 h-32" variant="outlined" component="label">
      {customIcon ?? <AttachFile color="primary" fontSize="large" />}
      <input
        type="file"
        hidden
        onChange={(ev) => {
          if (ev.target.files) onChange(Array.from(ev.target.files));
        }}
      />
    </Button>
  );
}
