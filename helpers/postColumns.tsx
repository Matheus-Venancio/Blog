import React from "react";
import Link from "next/link";
import { GridColDef } from "@mui/x-data-grid";
import { Post } from "@/interfaces/postInterface";
import dayjs from "dayjs";
import { Button } from "@nextui-org/react";
import { Edit, Visibility } from "@mui/icons-material";

export function getPostColumns(postType?: "event" | "general") {
  const columns: GridColDef<Post>[] = [
    {
      field: "pubDate",
      headerName: "Data pub.",
      valueFormatter(params) {
        if (params.value !== 0) {
          return dayjs(params.value * 1000).format("DD/MM/YYYY");
        }

        return "N/D";
      },
    },
    { field: "title", headerName: "Título", flex: 1 },
    {
      field: "isDraft",
      headerName: "Status",
      valueFormatter(params) {
        if (params.value) {
          return "Rascunho";
        }
        return "Publicado";
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      renderCell(params) {
        return postType && postType === "event" ? (
          <>
            <Link href={`/admin/edit-event-post/${params.row.id!}`}>
              <Button isIconOnly className="mr-1">
                <Edit />
              </Button>
            </Link>
            <Button isIconOnly>
              <Visibility />
            </Button>
          </>
        ) : (
          <>
            <Link href={`/admin/edit-post/${params.row.id!}`}>
              <Button isIconOnly className="mr-1">
                <Edit />
              </Button>
            </Link>
            <Button isIconOnly>
              <Visibility />
            </Button>
          </>
        );
      },
    },
  ];

  return columns;
}
