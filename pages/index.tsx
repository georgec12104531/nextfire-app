import Head from "next/head";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { firestore as fs } from "../lib/firebase";
import PostFeed from "../components/PostFeed";
import { postToJSON } from "../lib/helper";
import { fromMillis } from "../lib/firebase";

const LIMIT = 1;

export async function getServerSideProps() {
  let posts = [];

  // posts = await (await .get()).docs.map((doc) =>
  //   postToJSON(doc)
  // );

  const postRef = fs.collectionGroup("posts");
  const query = postRef
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);
  posts = (await query.get()).docs.map((doc) => postToJSON(doc));

  return {
    props: {
      posts: posts,
    },
  };
}

export default function Home({ posts }) {
  const [loading, setLoading] = useState(false);
  const [myPosts, setPosts] = useState(posts);
  const [postsEnd, setPostsEnd] = useState(false);

  const handleAddFakePost = () => {
    const ref = fs
      .collection("users")
      .doc("Si6AdAknTKQSV4SzJ93OcsxBnuu1")
      .collection("posts");

    let batch = fs.batch();
    [1, 2, 3, 4, 5, 6, 7, 8].forEach((item, index) => {
      const obj = {
        title: "Hello World",
        slug: "hello-world",
        uid: "userID",
        username: "jeffd23",
        published: true,
        content: "# hello world!",
        createdAt: new Date(),
        updatedAt: new Date(),
        heartCount: 0,
      };
      batch.set(ref.doc(), obj);
    });

    batch.commit();
  };

  const getMorePosts = async () => {
    setLoading(true);
    const last = myPosts[myPosts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    console.log("cursor: ", cursor);

    const query = fs
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(myPosts.concat(newPosts));
    setLoading(false);
  };

  return (
    <div>
      <Link
        prefetch={false}
        href={{ pathname: "/[username]", query: { username: "jeffd23" } }}
      >
        <a>Jeff's profile</a>
      </Link>
      <Loader show></Loader>
      {/* <button onClick={() => toast.success("hello toast!")}>toast me</button> */}
      {/* <button onClick={() => handleAddFakePost()}>Add fake post to db</button> */}
      <button onClick={getMorePosts}>Get More Posts</button>
      <PostFeed posts={myPosts} admin={true}></PostFeed>
      {postsEnd && 'You have reached the end!'}
    </div>
  );
}
