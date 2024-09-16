"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import {
  getEventPost,
  writeEventPost,
} from "@/api/firebase/eventPosts";
import dayjs from "dayjs";
import { signOutUser } from "@/api/firebase/auth";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import styles from "./editPost.module.css";
import PostImageGenerator from "@/components/admin/create-post/postImageLoader/postImageGenerator";
import PostImageSetter from "@/components/admin/create-post/postImageLoader/postImageSetter";
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { db } from "@/api/firebase/initialConfig";
import { commands } from "@uiw/react-md-editor";
import { EventPost } from "@/interfaces/eventPostInterface";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateEventPost() {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [formData, setFormData] = useState<EventPost>({
    id: "",
    title: "",
    subtitle: "",
    author: "",
    article: "",
    pubDate: 0,
    lastEdited: 0,
    coverUrl: "",
    isDraft: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [refreshImages, setRefreshImages] = useState(true);
  const [draftRef, setDraftRef] =
    useState<DocumentReference<DocumentData, DocumentData>>();

  useEffect(() => {
    async function fetchPost() {
      console.log("Fetching post");
      const futurePost = await getEventPost(params.id as string);

      if (futurePost) {
        setFormData(futurePost);
      }
    }

    setDraftRef(doc(db, `events/${params.id}`));
    const newUsername = sessionStorage.getItem("username");
    if (newUsername) setUsername(newUsername);

    fetchPost();
  }, []);

  // Handles autosaving
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    console.log("In effect");
    if (
      !formData.title &&
      !formData.subtitle &&
      !formData.author &&
      !formData.article &&
      !formData.coverUrl
    ) {
      // First load
      console.log("First load");
    } else {
      if (isAutoSaving) {
        setIsAutoSaving(false);
      }

      setIsAutoSaving(true);
      timeoutId = setTimeout(async () => {
        if (!isAutoSaving) {
          console.log("Autosave was canceled.");
          return;
        }

        console.log("autosaving...");

        if (!draftRef) {
          const newPostRef = doc(collection(db, "events"));

          const postData: EventPost = {
            ...formData,
            id: newPostRef.id,
            pubDate: dayjs().unix(),
            lastEdited: dayjs().unix(),
          };

          console.log(postData);

          await writeEventPost(newPostRef, postData)
            .then(() => {
              setDraftRef(newPostRef);
              console.log("Draft created");
              setShowAutoSave(true);
            })
            .catch((e) => console.error(e));
        } else {
          await writeEventPost(draftRef, {
            ...formData,
            id: draftRef.id,
            lastEdited: dayjs().unix(),
          })
            .then(() => {
              console.log("Draft updated");
              setShowAutoSave(true);
            })
            .catch((e) => console.error(e));
        }
      }, 5000);
      // autoSave();

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.title,
    formData.article,
    formData.subtitle,
    formData.author,
    formData.coverUrl,
    isAutoSaving,
  ]);

  function handleForm(
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [ev.target.name]: ev.target.value,
    });
  }

  async function handleSignOut() {
    await signOutUser();
  }

  async function handleCreatePost() {
    if (
      !formData.title ||
      !formData.subtitle ||
      !formData.author ||
      !formData.article ||
      !formData.coverUrl ||
      !draftRef
    )
      return;

    setIsLoading(true);

    await writeEventPost(draftRef, {
      id: draftRef.id,
      title: formData.title,
      subtitle: formData.subtitle,
      author: formData.author,
      article: formData.article,
      pubDate: dayjs().unix(),
      lastEdited: dayjs().unix(),
      coverUrl: formData.coverUrl,
      isDraft: false,
    })
      .then(() => {
        setSuccess(true);
        setOpen(false);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="p-3 sm:p-5">
      <header className="flex justify-between mb-5">
        <h1>{username}</h1>
        <div>
          <Button
            className="mr-2"
            onPress={() => setSignOutConfirm(true)}
            color="warning"
          >
            Sair
          </Button>
          <Link href="/admin/dashboard">
            <Button color="primary">Voltar</Button>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <h3>Post de evento</h3>
        <form
          className={styles.formContainer}
          onSubmit={(ev) => {
            ev.preventDefault();
            setOpen(true);
          }}
        >
          <Input
            required
            name="title"
            label="Titulo"
            color="primary"
            value={formData.title}
            onChange={handleForm}
          />
          <Input
            name="subtitle"
            color="primary"
            label="Subtitulo"
            value={formData.subtitle}
            onChange={handleForm}
          />
          <Input
            required
            name="author"
            label="Autor"
            color="primary"
            value={formData.author}
            onChange={handleForm}
          />
          <PostImageSetter
            refresh={refreshImages}
            onFinishRefresh={() => setRefreshImages(false)}
            onCoverSet={(coverUrl) => setFormData({ ...formData, coverUrl })}
          />
          <PostImageGenerator
            onUploadComplete={() => {
              console.log("upload complete!");
              setRefreshImages(true);
            }}
          />
          <h1>Editor de texto</h1>
          <Alert className="my-2" severity="info">
            Atenção! Textos sublinhados, &apos;hr&apos;, quotações, trechos de
            código, blocos de código, comentários e checklists não funcionam.
            Apenas os comandos no cabeçalho do editor de texto funcionam
          </Alert>
          <div style={{ height: "500px" }}>
            <MDEditor
              value={formData.article}
              height="100%"
              onChange={(value, event) =>
                event
                  ? handleForm({
                      ...event,
                      target: { ...event.target, name: "article" },
                    })
                  : null
              }
              commands={[
                commands.bold,
                commands.italic,
                commands.group(
                  [
                    commands.title1,
                    commands.title2,
                    commands.title3,
                    commands.title4,
                    commands.title5,
                    commands.title6,
                  ],
                  {
                    name: "title",
                    groupName: "title",
                    buttonProps: { "aria-label": "Insert title" },
                  }
                ),
                commands.link,
                commands.image,
                commands.unorderedListCommand,
                commands.orderedListCommand,
              ]}
            />
          </div>
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            onSubmit={(ev) => {
              ev.preventDefault();
              setOpen(true);
            }}
          >
            Publicar
          </Button>
        </form>
      </main>
      <Dialog
        open={signOutConfirm}
        onClose={() => setSignOutConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Tem certeza que deseja sair?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Caso saia, o estado atual das informações preenchidas não será
            salvo.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="danger"
            variant="flat"
            onPress={() => setSignOutConfirm(false)}
            autoFocus
          >
            Cancelar
          </Button>
          <Button variant="flat" onPress={handleSignOut}>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Tem certeza que deseja publicar?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Caso deseje revisar suas alterações antes de publicar, basta clicar
            em Cancelar
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            Cancelar
          </Button>
          <Button onClick={handleCreatePost}>
            {isLoading ? <CircularProgress /> : "Sim"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          O post foi publicado com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={1200}
        open={showAutoSave}
        onClose={() => setShowAutoSave(false)}
        message="Mudanças salvas"
      />
    </div>
  );
}
