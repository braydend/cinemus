import { type FC } from "react";
import { Divider } from "@mui/material";
import { Heading, Inspiration, TmdbInfo } from "../../atoms";
import { FeatureList } from "../../organisms";
import styles from "./about.module.css";

export const About: FC = () => {
  return (
    <main className={styles.container}>
      <Heading level="2">Features</Heading>
      <FeatureList />
      <Divider sx={{ margin: "1rem 0" }} />
      <Inspiration />
      <Divider sx={{ margin: "1rem 0" }} />
      <TmdbInfo />
    </main>
  );
};
