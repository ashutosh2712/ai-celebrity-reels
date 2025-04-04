import Head from "next/head";
import Reels from "../components/Reels";
export default function Home() {
  return (
    <>
      <Head>
        <title>Sports Reels</title>
        <meta name="description" content="AI-generated sports history reels" />
      </Head>
      <main className="bg-black text-white">
        <Reels />
      </main>
    </>
  );
}
