import { type FC } from "react";
import TV from "../../../assets/television.png";
import Search from "../../../assets/magnifying-glass.png";
import Tick from "../../../assets/check-mark.png";
import { type Icon } from "../../../content/icons";
import { Heading } from "../../atoms";
import Image, { type StaticImageData } from "next/image";

interface Props {
  title: string;
  body: string;
  icon: Icon;
  className?: string;
}

export const Card: FC<Props> = ({ title, body, icon, className = "" }) => {
  const icons: Record<Icon, StaticImageData> = {
    tv: TV,
    search: Search,
    tick: Tick,
  };

  return (
    <section
      key={title}
      className={`
    rounded-md border-8 border-cinemus-purple bg-cinemus-gray p-4 text-cinemus-purple
      ${className}
    `}
    >
      <Image
        className="mb-4 h-16 w-16 rounded p-2"
        src={icons[icon]}
        width={32}
        height={32}
        alt={`${icon} icon`}
      />
      <Heading level={"3"}>{title}</Heading>
      <p className="py-4 font-raleway">{body}</p>
    </section>
  );
};
