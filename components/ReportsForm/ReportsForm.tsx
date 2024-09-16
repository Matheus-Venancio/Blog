import React, { useCallback, useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/api/firebase/initialConfig";
import AttachCard from "@/components/AttachCard/AttachCard";
import { sendReport } from "@/api/firebase/reports";
import FileCard from "@/components/fileCard/FileCard";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { Button, Card, CardBody } from "@nextui-org/react";
import { adminUids, sendMail } from "@/api/firebase/mail";
import { mailMessage } from "@/helpers/formatMailMessage";
import styles from "./reportsForm.module.css";

export default function ReportsForm() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>();
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [filesUUID, setFilesUUID] = useState<string | null>(null);

  const createReportDoc = useCallback(async () => {
    const docRef = await sendReport({
      title,
      location,
      phone,
      description,
      date: dayjs().unix(),
      filesUUID,
      status: "unattended",
    });

    if (docRef) {
      await sendMail({
        toUids: adminUids,
        message: {
          subject: "DENÚNCIA - Núcleo de Campinas",
          html: mailMessage(),
        },
      });
      setSuccess(true);
      // console.log("Documento criado com sucesso!", docRef);
    }

    setIsLoading(false);
  }, [title, location, phone, description, filesUUID]);

  useEffect(() => {
    if (uploadSuccess) {
      createReportDoc();
    }
  }, [uploadSuccess, createReportDoc]);

  // Clears input errors
  useEffect(() => {
    if (title) setTitleError(false);
    if (phone) setPhoneError(false);
    if (location) setLocationError(false);
    if (description) setDescriptionError(false);
  }, [title, location, phone, description]);

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
      console.log(files);
    }
  }

  function handleInputErrors() {
    if (phone.length > 0 && phone.length !== 11) setPhoneError(true);
    if (!title) setTitleError(true);
    if (!location) setLocationError(true);
    if (!description) setDescriptionError(true);
  }

  function canSubmit() {
    if (
      (phone.length > 0 && phone.length !== 11) ||
      !title ||
      !location ||
      !description
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

    if (files) {
      handleFormSubmitWithFiles();
      return;
    }

    // No files to upload
    await createReportDoc();
    setIsLoading(false);
  }

  function handleFormSubmitWithFiles() {
    if (!files) return;

    const newFilesUUID = crypto.randomUUID();
    setFilesUUID(newFilesUUID);

    // Handle files upload
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      const storageRef = ref(
        storage,
        `/reports/${dayjs().format("DD-MM-YYYY")}/${newFilesUUID}${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadProgress(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
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
            console.log("UPLOAD DO ULTIMO ARQUIVO COM SUCESSO!");
            setUploadSuccess(true);
          }

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }

    setIsLoading(false);
  }

  if (success)
    return (
      <div>
        <h1>Denúncia enviada com sucesso!</h1>
        <p className="text-lg">
          Agora basta aguardar. Em menos de 48 horas você receberá uma resposta
          do suporte.
        </p>
      </div>
    );

  return (
    <form noValidate className={styles.container} onSubmit={handleFormSubmit}>
      <label>Título</label>
      <TextField
        required
        label="Título"
        variant="filled"
        value={title}
        error={titleError}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Local</label>
      <TextField
        required
        label="Local"
        value={location}
        variant="filled"
        error={locationError}
        onChange={(ev) => setLocation(ev.target.value)}
      />
      <label>Telefone (WhatsApp) - Opcional</label>
      <TextField
        value={phone}
        variant="filled"
        type="number"
        label="Telefone"
        error={phoneError}
        helperText="Apenas números. Ex: 19988776655"
        onChange={(ev) => setPhone(ev.target.value)}
      />
      <label>Descrição</label>
      <TextField
        required
        multiline
        minRows={4}
        variant="filled"
        label="Descrição"
        value={description}
        error={descriptionError}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Imagens</label>
      <div className={styles.imagesContainer}>
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
      </div>
      <Button
        type="submit"
        color="success"
        className="mt-1"
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
      >
        Enviar denúncia
      </Button>
    </form>
  );
}
