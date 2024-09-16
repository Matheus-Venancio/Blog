import { doc, getDoc } from "firebase/firestore";
import { db } from "./initialConfig";
import { MblAdmin } from "@/interfaces/mblAdmin";

export async function getAdminInfo(id: string) {
  const docRef = doc(db, "admins", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data() as MblAdmin;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}
