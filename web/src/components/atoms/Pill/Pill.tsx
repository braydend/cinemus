import { type FC } from "react";
import styles from "./Pill.module.css";

interface Props {
  label: string;
}

export const Pill: FC<Props> = ({ label }) => {
  return <span className={styles.pill}>{label}</span>;
};
