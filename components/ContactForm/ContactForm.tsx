"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import AttachCard from "@/components/AttachCard/AttachCard";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/api/firebase/initialConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import dayjs from "dayjs";
import styles from "./contactForm.module.css";
import FileCard from "../fileCard/FileCard";
import { Button } from "@nextui-org/react";
import { sendMessage } from "@/api/firebase/contact";
import { adminUids, sendMail } from "@/api/firebase/mail";
import { mailMessage } from "@/helpers/formatMailMessage";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [subject, setSubject] = useState("");
  const [subjectError, setSubjectError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [files, setFiles] = useState<File[]>();
  const [filesUUID, setFilesUUID] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Creates contact document and sends email to admins
   */
  const createContactDoc = useCallback(async () => {
    const docRef = await sendMessage({
      name,
      email,
      phone,
      subject,
      message,
      date: dayjs().unix(),
      filesUUID,
      status: "unattended",
    });

    if (docRef) {
      await sendMail({
        toUids: adminUids,
        message: {
          subject: "CONTATO - Núcleo de Campinas",
          html: mailMessage(name),
        },
      });
      setSuccess(true);
      // console.log("Documento criado com sucesso", docRef);
    }
  }, [name, email, phone, subject, message, filesUUID]);

  useEffect(() => {
    if (uploadSuccess) {
      createContactDoc();
    }
  }, [uploadSuccess, createContactDoc]);

  // Clears input errors
  useEffect(() => {
    if (name) setNameError(false);
    if (email) setEmailError(false);
    if (phone) setPhoneError(false);
    if (subject) setSubjectError(false);
    if (message) setMessageError(false);
  }, [name, email, phone, subject, message]);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles) {
      setFiles(newFiles);
    }
  };

  function handleFileRemove(id: number) {
    if (files) {
      const newFiles = [...files];
      newFiles.splice(id, 1);
      setFiles(newFiles);
    }
  }

  function handleInputErrors() {
    if (!name || name.length < 3) setNameError(true);
    if (!validateEmail(email) && phone.length !== 11) setPhoneError(true);
    if (!validateEmail(email) && phone === "") setEmailError(true);
    if (!subject) setSubjectError(true);
    if (!message) setMessageError(true);
  }

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function canSubmit() {
    if (
      (!validateEmail(email) && !(phone.length == 11)) ||
      !name ||
      name.length < 3 ||
      !subject ||
      !message
    )
      return false;

    return true;
  }

  async function handleFormSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setIsLoading(true);

    handleInputErrors();
    if (!canSubmit()) {
      setIsLoading(false);
      return;
    }

    if (files && files.length > 0) {
      // Uploading files and submitting form
      handleFormSubmitWithFiles();
      return;
    }

    // No files to upload
    await createContactDoc();

    setIsLoading(false);
  }

  function handleFormSubmitWithFiles() {
    if (!files) return;

    const newFilesUUID = crypto.randomUUID();
    setFilesUUID(newFilesUUID);

    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const storageRef = ref(
        storage,
        `/contact/${dayjs().format("DD-MM-YYYY")}/${newFilesUUID}${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          setUploadProgress(progress);

          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          alert("Erro no upload de arquivos. Tente novamente");
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          if (index === files.length - 1) {
            // console.log("UPLOAD DO ULTIMO ARQUIVO COM SUCESSO!");
            setUploadSuccess(true);
          }

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("File available at", downloadURL);
          });
        }
      );
    }

    setIsLoading(false);
  }

  if (success)
    return (
      <div>
        <h1>Mensagem enviada com sucesso!</h1>
        <p className="text-lg">
          Agora basta aguardar. Em menos de 48 horas você receberá uma resposta
          do suporte.
        </p>
      </div>
    );

  return (
    <form noValidate onSubmit={handleFormSubmit} className={styles.container}>
      <label>Nome</label>
      <TextField
        label="Nome"
        variant="filled"
        value={name}
        error={nameError}
        onChange={(ev) => {
          setName(ev.target.value);
        }}
      />
      <label>Email</label>
      <TextField
        required
        label="Email"
        type="email"
        variant="filled"
        value={email}
        error={emailError}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <label>Telefone (WhatsApp) - Opcional</label>
      <TextField
        label="Telefone"
        variant="filled"
        type="number"
        value={phone}
        error={phoneError}
        helperText="Apenas números. Ex: 19988776655"
        onChange={(ev) => setPhone(ev.target.value)}
      />
      <label>Assunto</label>
      <TextField
        required
        label="Assunto"
        variant="filled"
        value={subject}
        error={subjectError}
        onChange={(ev) => setSubject(ev.target.value)}
      />
      <label>Mensagem</label>
      <TextField
        required
        label="Mensagem"
        multiline
        minRows={4}
        value={message}
        variant="filled"
        error={messageError}
        onChange={(ev) => setMessage(ev.target.value)}
      />
      <label>Anexos</label>
      {files && files.length > 0 ? (
        new Array(files.length)
          .fill(undefined)
          .map((value, index) => (
            <FileCard
              key={index}
              name={files[index].name}
              size={files[index].size}
              handleRemove={() => handleFileRemove(index)}
            />
          ))
      ) : (
        <AttachCard onChange={handleFileChange} />
      )}
      <Button
        type="submit"
        className="mt-2"
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
        color="success"
      >
        Enviar mensagem
      </Button>
    </form>
  );
}
