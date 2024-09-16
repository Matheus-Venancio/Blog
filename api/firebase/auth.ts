import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "./initialConfig";
import { MblAdmin } from "@/interfaces/mblAdmin";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import dayjs from "dayjs";

export enum AuthResultStatus {
  successful,
  emailAlreadyExists,
  wrongPassword,
  invalidEmail,
  userNotFound,
  userDisabled,
  operationNotAllowed,
  tooManyRequests,
  undefined,
}

export function handleException(e: { code: string; message: string }) {
  let status;
  switch (e.code) {
    case "auth/invalid-email":
      status = AuthResultStatus.invalidEmail;
      break;
    case "auth/wrong-password":
      status = AuthResultStatus.wrongPassword;
      break;
    case "auth/user-not-found":
      status = AuthResultStatus.userNotFound;
      break;
    case "auth/user-disabled":
      status = AuthResultStatus.userDisabled;
      break;
    case "auth/too-many-requests":
      status = AuthResultStatus.tooManyRequests;
      break;
    case "auth/operation-not-allowed":
      status = AuthResultStatus.operationNotAllowed;
      break;
    case "auth/email-already-in-use":
      status = AuthResultStatus.emailAlreadyExists;
      break;
    default:
      status = AuthResultStatus.undefined;
  }
  return status;
}

export function generateExceptionMessage(exceptionCode: AuthResultStatus) {
  let errorMessage: string;
  switch (exceptionCode) {
    case AuthResultStatus.invalidEmail:
      errorMessage = "Endereço de email inválido.";
      break;
    case AuthResultStatus.wrongPassword:
      errorMessage = "Senha incorreta.";
      break;
    case AuthResultStatus.userNotFound:
      errorMessage = "Não existe usuário com esse email.";
      break;
    case AuthResultStatus.userDisabled:
      errorMessage = "O usuário com esse email foi desabilitado.";
      break;
    case AuthResultStatus.tooManyRequests:
      errorMessage = "Muitas requisições. Tente novamente mais tarde.";
      break;
    case AuthResultStatus.operationNotAllowed:
      errorMessage = "Entrar com email e senha não está habilitado.";
      break;
    case AuthResultStatus.emailAlreadyExists:
      errorMessage = "Email já registrado. Por favor, entre ou mude sua senha.";
      break;
    default:
      errorMessage = "Um erro inesperado ocorreu.";
  }

  return errorMessage;
}

export async function createAdmin(
  name: string,
  email: string,
  password: string,
  passwordC: string
) {
  if (!canCreateAdmin(name, email, password, passwordC)) return false;

  const userData = await createUserWithEmailAndPassword(auth, email, password);

  console.log(userData);

  if (userData) {
    await sendEmailVerification(auth.currentUser!);

    const success = await setDoc(doc(db, "admins", userData.user.uid), {
      id: userData.user.uid,
      name,
      email,
      createdAt: dayjs().unix(),
    })
      .then(() => true)
      .catch((error) => console.error(error));

    if (success) return true;
  }

  return false;
}

export async function signIn(email: string, password: string) {
  const status = await signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      if (userCredentials.user != null) {
        return AuthResultStatus.successful;
      } else {
        return AuthResultStatus.undefined;
      }
    })
    .catch((error) => {
      return handleException(error);
    });

  return status;
}

export async function signOutUser() {
  console.log("Signing out");
  await signOut(auth);
}

function canCreateAdmin(
  name: string,
  email: string,
  password: string,
  passwordC: string
) {
  if (name.length > 2 && email.length > 4 && password == passwordC) {
    return true;
  }

  return false;
}
