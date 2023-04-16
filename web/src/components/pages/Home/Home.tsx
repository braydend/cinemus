import { type FC } from "react";
import Typography from "@mui/material/Typography";
import styles from "./home.module.css";
import { Divider } from "@mui/material";
import { FeatureList } from "../../molecules";

export const Home: FC = () => {
  return (
    <main className={styles.main}>
      <Typography noWrap variant="h1" paddingBottom="0.5rem">
        Cinemus
      </Typography>
      <Typography variant="h2" className={styles.tagline}>
        Showtime Simplified
      </Typography>
      <Divider sx={{ margin: "1rem 0" }} />
      <FeatureList />
    </main>
  );
};
