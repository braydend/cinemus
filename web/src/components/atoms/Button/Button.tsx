import { type FC } from "react";

interface Props {
  label: string;
  onClick: () => void;
  variant: "purple";
  className?: string;
}

const variantStyles = {
  purple: `
    bg-cinemus-purple text-cinemus-yellow-pink border-cinemus-yellow-pink 
    hover:bg-cinemus-yellow-pink hover:text-cinemus-purple hover:border-cinemus-purple
    focus:bg-cinemus-yellow-pink focus:text-cinemus-purple focus:border-cinemus-purple
  `,
};

export const Button: FC<Props> = ({
  label,
  onClick,
  variant,
  className = "",
}) => (
  // TODO: Add raleway font
  <button
    className={`
    ${className} ${variantStyles[variant]} 
    rounded text-lg cursor-pointer font-raleway px-4 py-2 transition-colors border
    `}
    onClick={onClick}
  >
    {label}
  </button>
);
