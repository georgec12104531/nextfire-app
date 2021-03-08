import UserProfile from "../../components/UserProfile";
// import Metatags from '../../components/Metatags';
import PostFeed from "../../components/PostFeed";
import { getUserFromUsername, postToJSON } from "../../lib/helper";

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserFromUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  // const singlePost = fs.doc(`users/`)

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      {/* <Metatags
        title={user.username}
        description={`${user.username}'s public profile`}
      /> */}
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
