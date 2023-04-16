import { type FC } from "react";
import Typography from "@mui/material/Typography";
import styles from "./home.module.css";

export const Home: FC = () => {
  return (
    <main className={styles.main}>
      <Typography noWrap variant="h1" paddingBottom="0.5rem">
        Cinemus
      </Typography>
      <Typography variant="h2" className={styles.tagline}>
        Showtime Simplified
      </Typography>
    </main>
  );
};
