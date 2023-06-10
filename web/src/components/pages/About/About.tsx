import { type FC } from "react";
import { Divider } from "@mui/material";
import { Heading, Inspiration, TmdbInfo } from "../../atoms";
import { FeatureList } from "../../organisms";

export const About: FC = () => {
  return (
    <main className="text-cinemus-purple font-raleway">
      <Heading level="2">Features</Heading>
      <FeatureList />
      <Divider sx={{ margin: "1rem 0" }} />
      <Inspiration />
      <Divider sx={{ margin: "1rem 0" }} />
      <TmdbInfo />
    </main>
  );
};
