import { type FC } from "react";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  body: string;
}

export const Feature: FC<Props> = ({ title, body }) => (
  <section key={title}>
    <Typography variant="h3" color={"primary"}>
      {title}
    </Typography>
    <p>{body}</p>
  </section>
);
