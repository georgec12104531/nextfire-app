import AuthCheck from "../../components/AuthCheck";
import { useUserData } from "../../lib/hooks";
import { firestore } from "../../lib/firebase";

import { useCollectionData } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";

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
    </div>
  );
};

function CreateNewPost() {}
