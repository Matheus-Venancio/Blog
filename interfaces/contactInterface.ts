export interface Contact {
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  date: number;
  status: "unattended" | "attended";
  filesUUID: string | null;
}
