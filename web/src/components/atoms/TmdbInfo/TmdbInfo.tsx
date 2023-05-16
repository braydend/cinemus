import { type FC } from "react";
import { tmdb } from "../../../content";
import styles from "./TmdbInfo.module.css";
import { Heading } from "../Heading";
export const TmdbInfo: FC = () => (
  <section>
    <Heading level="2">{tmdb.title}</Heading>
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
