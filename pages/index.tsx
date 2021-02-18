import Head from "next/head";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import Link from "next/link";
import toast from "react-hot-toast";
import { firestore as fs } from "../lib/firebase";
import PostFeed from "../components/PostFeed";
import { postToJSON } from "../lib/helper";

const LIMIT = 1;

export async function getServerSideProps() {
  let posts = [];

  // posts = await (await .get()).docs.map((doc) =>
  //   postToJSON(doc)
  // );

  const postRef = fs.collectionGroup("posts");
  const query = postRef
    .where("published", "==", true)
    .orderBy("createdAt")
    .limit(LIMIT);
  posts = (await query.get()).docs.map((doc) => postToJSON(doc));

  

  // console.log("posts", posts);

  return {
    props: {
      posts: posts,
    },
  };
}

export default function Home({ posts }) {
  return (
    <div>
      <Link
        prefetch={false}
        href={{ pathname: "/[username]", query: { username: "jeffd23" } }}
      >
        <a>Jeff's profile</a>
      </Link>
      <Loader show></Loader>
      <button onClick={() => toast.success("hello toast!")}>toast me</button>
      <PostFeed posts={posts} admin={true}></PostFeed>
    </div>
  );
}
