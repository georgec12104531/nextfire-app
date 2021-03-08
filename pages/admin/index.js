import AuthCheck from "../../components/AuthCheck";
import { useUserData } from "../../lib/hooks";
import { firestore, serverTimestamp } from "../../lib/firebase";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { UserContext } from "../../lib/context";
import { useContext, useState } from "react";
import PostFeed from "../../components/PostFeed";

import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

import styles from "../../styles/Admin.module.css";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        {/* <CreateNewPost /> */}
      </AuthCheck>
    </main>
  );
}

const PostList = () => {
  const { user } = useUserData();
  // console.log("user: ", user);
  // console.log("username", username);
  // Get posts associated with a user
  // Render them out
  console.log(user);

  const postRef = firestore
    .collection("users")
    .doc(`${user.uid}`)
    .collection("posts")
    .orderBy("createdAt");

  const [snapshot] = useCollectionData(postRef);

  return (
    <div>
      <PostFeed posts={snapshot} />
      <CreateNewPost />
    </div>
  );
};

function CreateNewPost() {
  const router = useRouter();
  const { username, user } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = user.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
