import { type FC } from "react";
import styles from "./button.module.css";

interface Props {
  label: string;
  onClick: () => void;
  variant: "yellow" | "purple" | "palePurple";
  className?: string;
}

export const Button: FC<Props> = ({
  label,
  onClick,
  variant,
  className = "",
}) => (
  <button
    className={`${styles.button} ${styles[variant]} ${className}`}
    onClick={onClick}
  >
    {label}
  </button>
);
