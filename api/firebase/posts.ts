import {
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  where,
} from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";
import { db } from "./initialConfig";
import { Post } from "@/interfaces/postInterface";

/**
 * Handles creation and update of a post.
 * @param postRef the reference to an existing or not document
 * @param postData the post data
 * @returns the document reference
 */
export async function writePost(postRef: DocumentReference, postData: Post) {
  return await setDoc(postRef, postData)
    .then((docRef) => docRef)
    .catch((error) => console.error(error));
}

export async function getPost(id: string) {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data() as Post;
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
  }
}

export async function getLandingPagePosts() {
  const postsRef = collection(db, "posts");

  const q = query(
    postsRef,
    where("isDraft", "==", false),
    orderBy("pubDate", "desc"),
    limit(3)
  );

  const latestPosts: Post[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    latestPosts.push(doc.data() as Post);
  });

  return latestPosts;
}

/** Get all posts that are not drafts */
export async function getPostsList() {
  const postsRef = collection(db, "posts");

  const q = query(
    postsRef,
    where("isDraft", "==", false),
    orderBy("pubDate", "desc")
  );

  const postList: Post[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    postList.push(doc.data() as Post);
  });

  return postList;
}

export async function getPostsAndDraftsList() {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("pubDate", "desc"));

  const postList: Post[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    postList.push(doc.data() as Post);
  });

  return postList;
}
