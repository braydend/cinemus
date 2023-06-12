import { type NextPage } from "next";
import { FeatureList } from "~/components/organisms";
import { Divider } from "@mui/material";
import { Heading, Inspiration, TmdbInfo } from "../../components/atoms";

const AboutPage: NextPage = () => {
  return (
    <main className="font-raleway text-cinemus-purple">
      <Heading level="2">Features</Heading>
      <FeatureList />
      <Divider sx={{ margin: "1rem 0" }} />
      <Inspiration />
      <Divider sx={{ margin: "1rem 0" }} />
      <TmdbInfo />
    </main>
  );
};

export default AboutPage;
