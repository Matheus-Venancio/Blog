import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./initialConfig";
import { Contact } from "@/interfaces/contactInterface";

export async function sendMessage(contactData: Contact) {
  return await addDoc(collection(db, "contact"), contactData)
    .then((docRef) => docRef)
    .catch((error) => console.error(error));
}

export async function getContactList() {
  const postsRef = collection(db, "contact");

  const q = query(postsRef, orderBy("date", "asc"));

  const contacts: Contact[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    contacts.push(doc.data() as Contact);
    // console.log(doc.id, " => ", doc.data());
  });

  return contacts;
}
