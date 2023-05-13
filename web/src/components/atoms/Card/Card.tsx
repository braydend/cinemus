import { type FC } from "react";
import Typography from "@mui/material/Typography";
import styles from "./card.module.css";
import TV from "../../../assets/television.png";
import Search from "../../../assets/magnifying-glass.png";
import Tick from "../../../assets/check-mark.png";
import { type Icon } from "../../../content/icons";

interface Props {
  title: string;
  body: string;
  icon: Icon;
  variant: "yellow" | "purple";
  className?: string;
}

export const Card: FC<Props> = ({
  title,
  body,
  icon,
  variant,
  className = "",
}) => {
  const icons: Record<Icon, string> = {
    tv: TV,
    search: Search,
    tick: Tick,
  };

  return (
    <section
      key={title}
      className={`${styles.container} ${styles[variant]} ${className}`}
    >
      <img
        className={styles.icon}
        src={icons[icon]}
        width={32}
        height={32}
        alt={`${icon} icon`}
      />
      <h3 className={styles.heading}>{title}</h3>
      <p className={styles.body}>{body}</p>
    </section>
  );
};
