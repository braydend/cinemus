import { type FC } from "react";
import styles from "./card.module.css";
import TV from "../../../assets/television.png";
import Search from "../../../assets/magnifying-glass.png";
import Tick from "../../../assets/check-mark.png";
import { type Icon } from "../../../content/icons";
import { Heading } from "../../atoms";

interface Props {
  title: string;
  body: string;
  icon: Icon;
  className?: string;
}

export const Card: FC<Props> = ({ title, body, icon, className = "" }) => {
  const icons: Record<Icon, string> = {
    tv: TV,
    search: Search,
    tick: Tick,
  };

  return (
    <section key={title} className={`${styles.container} ${className}`}>
      <img
        className={styles.icon}
        src={icons[icon]}
        width={32}
        height={32}
        alt={`${icon} icon`}
      />
      <Heading level={"3"}>{title}</Heading>
      <p className={styles.body}>{body}</p>
    </section>
  );
};
