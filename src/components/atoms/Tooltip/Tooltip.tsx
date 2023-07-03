import { type FC, type PropsWithChildren } from "react";

type Props = { content: string };

export const Tooltip: FC<PropsWithChildren<Props>> = ({
  children,
  content,
}) => {
  return (
    <div className="group relative">
      {children}
      <span className="invisible absolute top-16 z-10 inline-block rounded-sm border border-cinemus-purple bg-white p-2 group-hover:visible group-active:visible">
        {content}
      </span>
    </div>
  );
};
