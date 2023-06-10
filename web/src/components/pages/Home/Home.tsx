import { type FC } from "react";
import { FeatureList } from "../../organisms";
import textLogo from "../../../assets/textLogo.png";

export const Home: FC = () => {
  return (
    <main className="flex flex-col items-center">
      <img src={textLogo} alt="Cinemus" className="w-full md:w-3/4" />
      <h2 className="pb-8 font-raleway inline text-center shrink text-cinemus-purple text-6xl m-0">
        Showtime Simplified
      </h2>
      <div className="flex flex-col justify-around h-full">
        <FeatureList />
      </div>
    </main>
  );
};
