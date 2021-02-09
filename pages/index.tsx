import Head from "next/head";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Home() {
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
    </div>
  );
}
