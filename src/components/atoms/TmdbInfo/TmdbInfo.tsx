import { type FC } from "react";
import { tmdb } from "../../../content";
import { Heading } from "../Heading";

export const TmdbInfo: FC = () => (
  <section>
    <Heading level="2">{tmdb.title}</Heading>
    <p className="py-4">{tmdb.body}</p>
    <p className="py-4">
      {tmdb.disclaimer}{" "}
      <a
        target={"_blank"}
        href={tmdb.link}
        rel="noreferrer"
        className="text-cinemus-purple visited:text-cinemus-purple underline"
      >
        {tmdb.link}
      </a>
      .
    </p>
  </section>
);
