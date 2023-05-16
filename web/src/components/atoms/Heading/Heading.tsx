import { type FC } from "react";
import styles from "./Heading.module.css";

interface Props {
  level: "1" | "2" | "3" | "4" | "5";
  children: JSX.Element | string;
  className?: string;
}

export const Heading: FC<Props> = ({ level, children, className }) => {
  switch (level) {
    case "1":
      return (
        <h1 className={`${styles.heading} ${styles.h1} ${className ?? ""}`}>
          {children}
        </h1>
      );
    case "2":
      return (
        <h2 className={`${styles.heading} ${styles.h2} ${className ?? ""}`}>
          {children}
        </h2>
      );
    case "3":
      return (
        <h3 className={`${styles.heading} ${styles.h3} ${className ?? ""}`}>
          {children}
        </h3>
      );
    case "4":
      return (
        <h4 className={`${styles.heading} ${styles.h4} ${className ?? ""}`}>
          {children}
        </h4>
      );
    case "5":
      return (
        <h5 className={`${styles.heading} ${styles.h5} ${className ?? ""}`}>
          {children}
        </h5>
      );
  }
};
