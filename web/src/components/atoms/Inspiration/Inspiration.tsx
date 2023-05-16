import { type FC } from "react";
import { inspiration } from "../../../content";
import { Heading } from "../Heading";
export const Inspiration: FC = () => (
  <section>
    <Heading level="2">{inspiration.title}</Heading>
    <p>{inspiration.body}</p>
  </section>
);
