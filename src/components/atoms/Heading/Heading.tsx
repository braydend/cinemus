import { ReactNode, type FC } from "react";

interface Props {
  level: "1" | "2" | "3" | "4" | "5";
  children: ReactNode;
  className?: string;
}

export const Heading: FC<Props> = ({ level, children, className }) => {
  switch (level) {
    case "1":
      return (
        <h1 className={`m-0 font-algera text-7xl ${className ?? ""}`}>
          {children}
        </h1>
      );
    case "2":
      return (
        <h2 className={`m-0 font-algera text-6xl ${className ?? ""}`}>
          {children}
        </h2>
      );
    case "3":
      return (
        <h3 className={`m-0 font-algera text-5xl ${className ?? ""}`}>
          {children}
        </h3>
      );
    case "4":
      return (
        <h4 className={`m-0 font-algera text-4xl ${className ?? ""}`}>
          {children}
        </h4>
      );
    case "5":
      return (
        <h5 className={`m-0 font-algera text-3xl ${className ?? ""}`}>
          {children}
        </h5>
      );
  }
};
