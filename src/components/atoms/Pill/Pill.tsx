import { type FC } from "react";
// import styles from "./Pill.module.css";

interface Props {
  label: string;
}

export const Pill: FC<Props> = ({ label }) => {
  return (
    <span className="h-fit w-min whitespace-nowrap rounded border border-purple-950 px-2 py-0 text-purple-950">
      {label}
    </span>
  );
};
