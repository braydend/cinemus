import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import textLogo from "~/assets/textLogo.png";
import { MediaSearch } from "../../components/organisms";
import type { MediaResponse } from "../../server/domain/media";

const PivotHome: NextPage = () => {
  const handleSelect = (selection: MediaResponse) => {
    console.log(selection);
  };

  return (
    <>
      <Head>
        <title>Cinemus</title>
        <meta name="description" content="Showtime Simplified" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="flex flex-col items-center">
        <Image src={textLogo} alt="Cinemus" className="w-full md:w-3/4" />
        <MediaSearch onSelect={handleSelect} />
      </main>
    </>
  );
};

export default PivotHome;
