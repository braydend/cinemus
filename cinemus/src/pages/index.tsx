import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FeatureList } from "~/components/organisms";
import textLogo from "~/assets/textLogo.png";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cinemus</title>
        <meta name="description" content="Showtime Simplified" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex flex-col items-center">
        <Image src={textLogo} alt="Cinemus" className="w-full md:w-3/4" />
        <h2 className="m-0 inline shrink pb-8 text-center font-raleway text-6xl text-cinemus-purple">
          Showtime Simplified
        </h2>
        <div className="flex h-full flex-col justify-around">
          <FeatureList />
        </div>
      </main>
    </>
  );
};

export default Home;
