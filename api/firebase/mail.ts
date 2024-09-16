import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "./initialConfig";

interface NodemailerSendMailOptions {
  subject: string;
  text?: string;
  html?: string;
}

export const adminUids = [
  "8d5QW3nZWEbj3WXP7ETXB2W5KCL2",
  "9LXPBFu3sHTT204INgiJ5ELQhFw1",
  "DCCdUwkv92fitBHEkSM6QdbTk9Z2",
  "bkPU2XShVOf9dQ6m49RsyvpNCgu1",
  "hUIa3kNX8odLWTqg8Udyilc7lPL2",
];

/* Check https://github.com/firebase/extensions/blob/next/firestore-send-email/
 * for more information on QueuePayload interface
 */
interface QueuePayload {
  delivery?: {
    startTime: Timestamp;
    endTime: Timestamp;
    leaseExpireTime: Timestamp;
    state: "PENDING" | "PROCESSING" | "RETRY" | "SUCCESS" | "ERROR";
    attempts: number;
    error?: string;
    info?: {
      messageId: string;
      accepted: string[];
      rejected: string[];
      pending: string[];
    };
  };
  message?: NodemailerSendMailOptions;
  template?: {
    name: string;
    data?: { [key: string]: any };
  };
  to?: string | string[];
  toUids?: string[];
  cc?: string[];
  ccUids?: string[];
  bcc?: string[];
  bccUids?: string[];
  from?: string;
  replyTo?: string;
  headers?: any;
  //   attachments: Attachment[];
}

export async function sendMail(mailData: QueuePayload) {
  if (!mailData.to && !mailData.toUids) {
    console.error("No specified recipients");
  }
  return await addDoc(collection(db, "mail"), mailData)
    .then((docRef) => docRef)
    .catch((error) => console.error(error));
}
