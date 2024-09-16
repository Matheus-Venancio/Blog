"use client";

import React, { useState } from "react";
import FileCard from "@/components/fileCard/FileCard";
import AttachCard from "@/components/AttachCard/AttachCard";
import { Add } from "@mui/icons-material";
import { Button } from "@nextui-org/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/api/firebase/initialConfig";

export default function PostImageGenerator({
  onUploadComplete,
}: {
  onUploadComplete: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  function addFile(file: File[]) {
    if (file) {
      const newFiles = [...files];

      newFiles.push(file[0]);

      setFiles(newFiles);
    }
  }

  function removeFile(id: number) {
    if (files && files.length > 0) {
      const newFiles = [...files];
      newFiles.splice(id, 1);
      setFiles(newFiles);
    }
  }

  function uploadImages() {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];

      setIsLoading(true);

      const storageRef = ref(storage, `/blog/${file.name}`);
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
          setIsLoading(false);
          alert("Erro no upload de arquivos. Tente novamente");
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...

          // console.log("UPLOAD DO ULTIMO ARQUIVO COM SUCESSO!");
          if (index === files.length - 1) {
            setUploadSuccess(true);
            setIsLoading(false);
            setFiles([]);
            onUploadComplete();
          }

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  }

  return (
    <div>
      <h1 className="mb-2">Carregar imagens</h1>
      {files && files.length > 0 ? (
        <>
          <div className="flex flex-wrap [&_div]:mr-3 [&_div]:mb-2 [&_label]:mb-2">
            {new Array(files.length).fill(undefined).map((value, index) => (
              <FileCard
                key={index}
                name={files[index].name}
                size={files[index].size}
                imgSrc={URL.createObjectURL(files[index])}
                handleRemove={() => removeFile(index)}
              />
            ))}
            <AttachCard
              customIcon={<Add fontSize="large" />}
              onChange={addFile}
            />
          </div>
          <Button color="success" onClick={uploadImages} isLoading={isLoading}>
            Gerar links
          </Button>
        </>
      ) : (
        <AttachCard onChange={addFile} />
      )}
    </div>
  );
}
