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
import { getPost, writePost } from "@/api/firebase/posts";
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
import { Post } from "@/interfaces/postInterface";
import { commands } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function EditPost() {
  const [open, setOpen] = useState(false);
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("");
  const [article, setArticle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [refreshImages, setRefreshImages] = useState(true);
  const [coverImage, setCoverImage] = useState("");
  const params = useParams();
  const [draftRef, setDraftRef] =
    useState<DocumentReference<DocumentData, DocumentData>>();

  const currentPostData: Post = {
    id: draftRef?.id || "0",
    title,
    subtitle,
    author,
    article,
    pubDate: 0,
    lastEdited: 0,
    coverUrl: coverImage,
    isDraft: true,
  };

  useEffect(() => {
    async function fetchPost() {
      console.log("Fetching post");
      const futurePost = await getPost(params.id as string);

      if (futurePost) {
        setTitle(futurePost.title);
        setSubtitle(futurePost.subtitle ?? "");
        setAuthor(futurePost.author);
        setArticle(futurePost.article);
        setCoverImage(futurePost.coverUrl);
      }
    }

    setDraftRef(doc(db, `posts/${params.id}`));
    const newUsername = sessionStorage.getItem("username");
    if (newUsername) setUsername(newUsername);

    fetchPost();
  }, []);

  // Handles autosaving
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    console.log("In effect");
    if (
      !currentPostData.title &&
      !currentPostData.subtitle &&
      !currentPostData.author &&
      !currentPostData.article &&
      !currentPostData.coverUrl
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
          const newPostRef = doc(collection(db, "posts"));

          const postData: Post = {
            ...currentPostData,
            pubDate: dayjs().unix(),
            lastEdited: dayjs().unix(),
            id: newPostRef.id,
          };

          await writePost(newPostRef, postData);

          setDraftRef(newPostRef);

          console.log("Draft created");
          setShowAutoSave(true);
        } else {
          await writePost(draftRef, {
            ...currentPostData,
            lastEdited: dayjs().unix(),
            id: draftRef.id,
          });

          console.log("Draft updated");
          setShowAutoSave(true);
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
    currentPostData.title,
    currentPostData.article,
    currentPostData.subtitle,
    currentPostData.author,
    currentPostData.coverUrl,
    isAutoSaving,
  ]);

  async function handleSignOut() {
    await signOutUser();
  }

  async function handleCreatePost() {
    if (!title || !subtitle || !author || !article || !coverImage || !draftRef)
      return;

    setIsLoading(true);

    await writePost(draftRef, {
      id: draftRef.id,
      title,
      subtitle,
      author,
      article,
      pubDate: dayjs().unix(),
      lastEdited: dayjs().unix(),
      coverUrl: coverImage,
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
        <div className="flex"></div>
        <form
          className={styles.formContainer}
          onSubmit={(ev) => {
            ev.preventDefault();
            setOpen(true);
          }}
        >
          <Input
            required
            label="Titulo"
            color="primary"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <Input
            color="primary"
            label="Subtitulo"
            value={subtitle}
            onChange={(ev) => setSubtitle(ev.target.value)}
          />
          <Input
            required
            label="Autor"
            color="primary"
            value={author}
            onChange={(ev) => setAuthor(ev.target.value)}
          />
          <PostImageSetter
            refresh={refreshImages}
            onFinishRefresh={() => setRefreshImages(false)}
            onCoverSet={(coverUrl) => setCoverImage(coverUrl)}
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
              value={article}
              height="100%"
              onChange={(value) => setArticle(value ?? "")}
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
