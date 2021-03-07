import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  // return
  return (
    <div>
      {username
        ? props.children
        : <div>fallback</div> || (
            <Link href="/enter">You must be signed in</Link>
          )}
    </div>
  );
}
