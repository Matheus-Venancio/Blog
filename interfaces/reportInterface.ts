export interface Report {
  date: number;
  title: string;
  location: string;
  description: string;
  phone?: string;
  filesUUID: string | null;
  status: "unattended" | "attended";
}
