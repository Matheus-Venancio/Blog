"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import PasswordInput from "@/components/PasswordInput/passwordInput";
import {
  AuthResultStatus,
  createAdmin,
  generateExceptionMessage,
  handleException,
  signIn,
} from "@/api/firebase/auth";
import { Alert, Snackbar } from "@mui/material";

export default function SignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [excepitonMessage, setExcepitonMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [excepiton, setException] = useState(false);
  const router = useRouter();

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    console.log("Criando conta");
    setIsLoading(true);

    const result = await createAdmin(name, email, password, passwordC);

    if (result) {
      setSuccess(true);
      clearFields();
      router.push("/admin/dashboard");
    }

    setIsLoading(false);
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const status = await signIn(email, password);

    if (status !== AuthResultStatus.successful) {
      setExcepitonMessage(generateExceptionMessage(status));
      setException(true);
      clearFields();
    }

    setIsLoading(false);
  }

  function clearFields() {
    setEmail("");
    setPassword("");
    setPasswordC("");
    setName("");
  }

  return (
    <div className={styles.container}>
      <Card style={{ minWidth: "350px" }}>
        <CardBody>
          <h1 style={{ fontSize: "x-large", marginBottom: "10px" }}>
            MBL Campinas - Administrador
          </h1>
          <Tabs aria-label="Options" fullWidth onSelectionChange={clearFields}>
            <Tab key="login" title="Entrar">
              <form className={styles.formContainer} onSubmit={handleSignIn}>
                <Input
                  isClearable
                  label="Email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                <PasswordInput
                  label="Senha"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isLoading}
                  onSubmit={handleSignIn}
                  style={{ marginTop: "10px" }}
                >
                  Entrar
                </Button>
              </form>
            </Tab>
            {/* <Tab key="signup" title="Cadastrar-se">
              <form className={styles.formContainer} onSubmit={handleSignUp}>
                <Input
                  isClearable
                  label="Nome"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <Input
                  isClearable
                  label="Email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />
                <PasswordInput
                  label="Senha"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                <PasswordInput
                  label="Confirmar senha"
                  value={passwordC}
                  onChange={(ev) => setPasswordC(ev.target.value)}
                />
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  onSubmit={handleSignUp}
                  style={{ marginTop: "10px" }}
                >
                  Cadastrar-se
                </Button>
              </form>
            </Tab> */}
          </Tabs>
        </CardBody>
      </Card>
      <Snackbar
        autoHideDuration={2000}
        open={excepiton}
        onClose={() => setException(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setException(false)}>
          {excepitonMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
