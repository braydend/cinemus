import { type FC } from "react";
import styles from "./feature.module.css";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  body: string;
  icon: JSX.Element;
}

export const Feature: FC<Props> = ({ title, body, icon }) => (
  <section key={title} className={styles.section}>
    <div className={styles.iconContainer}>{icon}</div>
    <Typography variant="h3" color={"primary"}>
      {title}
    </Typography>
    <p>{body}</p>
  </section>
);
