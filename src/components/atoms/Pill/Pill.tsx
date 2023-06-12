import { type FC } from "react";
// import styles from "./Pill.module.css";

interface Props {
  label: string;
}

export const Pill: FC<Props> = ({ label }) => {
  return (
    <span className="rounded border border-purple-950 whitespace-nowrap py-0 px-2 h-fit text-purple-950">
      {label}
    </span>
  );
};
