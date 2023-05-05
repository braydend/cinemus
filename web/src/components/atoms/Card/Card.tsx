import { type FC } from "react";
import Typography from "@mui/material/Typography";
import styles from "./card.module.css";

interface Props {
  title: string;
  body: string;
  variant: "yellow" | "purple";
  className?: string;
}

export const Card: FC<Props> = ({ title, body, variant, className = "" }) => (
  <section
    key={title}
    className={`${styles.container} ${styles[variant]} ${className}`}
  >
    <Typography variant="h3">{title}</Typography>
    <p>{body}</p>
  </section>
);
