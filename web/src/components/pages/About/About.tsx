import { type FC } from "react";
import Typography from "@mui/material/Typography";
import styles from "./about.module.css";
import { Divider } from "@mui/material";
import { Inspiration, TmdbInfo } from "../../atoms";
import { FeatureList } from "../../molecules";

export const About: FC = () => {
  return (
    <main className={styles.main}>
      <Typography noWrap variant="h2" paddingBottom="0.5rem">
        Features
      </Typography>
      <FeatureList />
      <Divider sx={{ margin: "1rem 0" }} />
      <Inspiration />
      <Divider sx={{ margin: "1rem 0" }} />
      <TmdbInfo />
    </main>
  );
};
