import { type FC } from "react";
import { inspiration } from "../../../content";
import { Heading } from "../Heading";
export const Inspiration: FC = () => (
  <section>
    <Heading level="2">{inspiration.title}</Heading>
    <p className="py-4">{inspiration.body}</p>
  </section>
);
