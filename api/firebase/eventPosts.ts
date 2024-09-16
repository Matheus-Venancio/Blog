import {
  DocumentReference,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
} from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";
import { db } from "./initialConfig";
import { EventPost } from "@/interfaces/eventPostInterface";

/**
 * Handles creation and update of an event post.
 * @param postRef the reference to an existing or not document
 * @param postData the post data
 * @returns the document reference
 */
export async function writeEventPost(
  postRef: DocumentReference,
  postData: EventPost
) {
  return await setDoc(postRef, postData)
    .then((docRef) => docRef)
    .catch((error) => {
      throw new Error(error);
    });
}

export async function getEventPost(id: string) {
  const docRef = doc(db, "events", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data() as EventPost;
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
}

export async function getLandingPageEvents() {
  const postsRef = collection(db, "events");

  const q = query(
    postsRef,
    where("isDraft", "==", false),
    orderBy("pubDate", "desc"),
    limit(3)
  );

  const latestPosts: EventPost[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    latestPosts.push(doc.data() as EventPost);
    // console.log(doc.id, " => ", doc.data());
  });

  return latestPosts;
}

/** Get all posts that are not drafts */
export async function getEventPostsList() {
  const postsRef = collection(db, "events");

  const q = query(
    postsRef,
    where("isDraft", "==", false),
    orderBy("pubDate", "desc")
  );

  const postList: EventPost[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    postList.push(doc.data() as EventPost);
    // console.log(doc.id, " => ", doc.data());
  });

  return postList;
}

export async function getEventPostsAndDraftsList() {
  const postsRef = collection(db, "events");

  const q = query(postsRef, orderBy("pubDate", "desc"));

  const postList: EventPost[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    postList.push(doc.data() as EventPost);
    // console.log(doc.id, " => ", doc.data());
  });

  return postList;
}
