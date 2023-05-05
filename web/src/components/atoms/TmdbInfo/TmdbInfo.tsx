import { type FC } from "react";
import Typography from "@mui/material/Typography";
import { tmdb } from "../../../content";
import styles from "./TmdbInfo.module.css";
export const TmdbInfo: FC = () => (
  <section>
    <Typography variant="h2">{tmdb.title}</Typography>
    <p>{tmdb.body}</p>
    <p>
      {tmdb.disclaimer}{" "}
      <a
        target={"_blank"}
        href={tmdb.link}
        rel="noreferrer"
        className={styles.link}
      >
        {tmdb.link}
      </a>
      .
    </p>
  </section>
);
