"use client";

import ContactModal from "@/components/admin/dashboard/contactModal/contactModal";
import ReportModal from "@/components/admin/dashboard/reportModal/reportModal";
import { getContactList } from "@/api/firebase/contact";
import { getReportsList } from "@/api/firebase/reports";
import { Contact } from "@/interfaces/contactInterface";
import { Report } from "@/interfaces/reportInterface";
import { DataGrid, GridColDef, ptBR } from "@mui/x-data-grid";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signOutUser } from "@/api/firebase/auth";
import { getPostsAndDraftsList } from "@/api/firebase/posts";
import { Post } from "@/interfaces/postInterface";
import { Edit, Visibility } from "@mui/icons-material";
import { EventPost } from "@/interfaces/eventPostInterface";
import { getEventPostsAndDraftsList } from "@/api/firebase/eventPosts";
import { getPostColumns } from "@/helpers/postColumns";

export default function Dashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [eventPosts, setEventPosts] = useState<EventPost[]>([]);
  const [contact, setContact] = useState<Contact>();
  const [report, setReport] = useState<Report>();
  const [viewingContact, setViewingContact] = useState(false);
  const [viewingReport, setViewingReport] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const newUsername = sessionStorage.getItem("username");

    if (newUsername) setUsername(newUsername);
  }, []);

  useEffect(() => {
    async function fetchContacts() {
      const futureContacts = await getContactList();

      setContacts(futureContacts);
    }

    async function fetchReports() {
      const futureReports = await getReportsList();

      setReports(futureReports);
    }

    async function fetchPosts() {
      const futurePosts = await getPostsAndDraftsList();
      const futureEventPosts = await getEventPostsAndDraftsList();

      setPosts(futurePosts);
      setEventPosts(futureEventPosts);
    }

    fetchContacts();
    fetchReports();
    fetchPosts();
  }, []);

  async function handleSignOut() {
    await signOutUser();
  }

  const columns: GridColDef<Contact>[] = [
    {
      field: "date",
      headerName: "Data",
      valueFormatter(params) {
        return dayjs(params.value * 1000).format("DD/MM/YYYY");
      },
    },
    {
      field: "subject",
      headerName: "Assunto",
      flex: 1,
    },
    {
      field: "view",
      headerName: "Visualização",
      sortable: false,
      filterable: false,
      renderCell(params) {
        return (
          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              setContact(params.row);
              setViewingContact(true);
            }}
          >
            Visualizar
          </Button>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      valueFormatter(params) {
        if (params.value === "unattended") return "Não atendido";
        return "Atendido";
      },
      minWidth: 120,
    },
  ];

  const reportsColumns: GridColDef<Report>[] = [
    {
      field: "date",
      headerName: "Data",
      valueFormatter(params) {
        return dayjs(params.value * 1000).format("DD/MM/YYYY");
      },
    },
    {
      field: "title",
      headerName: "Título",
      flex: 1,
    },
    {
      field: "view",
      headerName: "Visualizar",
      sortable: false,
      filterable: false,
      renderCell(params) {
        return (
          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              setReport(params.row);
              setViewingReport(true);
            }}
          >
            Visualizar
          </Button>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      valueFormatter(params) {
        if (params.value === "unattended") return "Não atendido";
        return "Atendido";
      },
      minWidth: 120,
    },
  ];

  return (
    <div className="p-8">
      <header className="flex justify-between">
        <h1 className="text-3xl mb-3">Bem vindo, {username}!</h1>
        <div>
          <Button className="mr-2" color="warning" onPress={handleSignOut}>
            Sair
          </Button>
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button color="primary">Novo post</Button>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <Link href="/admin/create-post" className="my-1 mx-2">
                Post geral
              </Link>
              <Link href="/admin/create-event-post" className="my-1 mx-2">
                Post de evento
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <h2 className="text-3xl mb-3">Contato</h2>
      <DataGrid
        autoHeight
        rows={contacts}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 15]}
        getRowId={(row) => row.date}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
      <h2 className="text-3xl my-3">Denúncias</h2>
      <DataGrid
        autoHeight
        rows={reports}
        columns={reportsColumns}
        disableRowSelectionOnClick
        getRowId={(row) => row.date}
        pageSizeOptions={[5, 10, 15]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
      <h2 className="text-3xl my-3">Posts gerais</h2>
      <DataGrid
        autoHeight
        rows={posts}
        columns={getPostColumns()}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 15]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
      <h2 className="text-3xl my-3">Posts de evento</h2>
      <DataGrid
        autoHeight
        rows={eventPosts}
        columns={getPostColumns("event")}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 15]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
      <ContactModal
        isOpen={viewingContact}
        setOpen={setViewingContact}
        contactInfo={contact!}
      />
      <ReportModal
        isOpen={viewingReport}
        setOpen={setViewingReport}
        reportInfo={report!}
      />
    </div>
  );
}
