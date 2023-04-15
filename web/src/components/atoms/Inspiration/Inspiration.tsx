import { type FC } from "react";
import Typography from "@mui/material/Typography";
import { inspiration } from "../../../content";
export const Inspiration: FC = () => (
  <section>
    <Typography variant="h2">{inspiration.title}</Typography>
    <p>{inspiration.body}</p>
  </section>
);
