import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./initialConfig";
import { Report } from "@/interfaces/reportInterface";

export async function sendReport(reportData: Report) {
  return await addDoc(collection(db, "reports"), reportData)
    .then((docRef) => docRef)
    .catch((error) => console.error(error));
}

export async function getReportsList() {
  const postsRef = collection(db, "reports");

  const q = query(postsRef, orderBy("date", "asc"));

  const reports: Report[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    reports.push(doc.data() as Report);
    // console.log(doc.id, " => ", doc.data());
  });

  return reports;
}
