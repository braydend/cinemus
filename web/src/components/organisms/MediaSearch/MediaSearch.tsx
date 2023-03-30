import { type FC, useState } from "react";
import { type Media, type MediaType } from "../../../types";
import { MediaTypeSelector } from "../../atoms";
import { SearchBox } from "../../molecules";

interface Props {
  onSelect: (selection: Media) => void;
}

export const MediaSearch: FC<Props> = ({ onSelect }) => {
  const [mediaType, setMediaType] = useState<MediaType>("movie");

  const handleMediaTypeChange = (value: MediaType): void => {
    setMediaType(value);
  };

  return (
    <div>
      <MediaTypeSelector onChange={handleMediaTypeChange} />
      <SearchBox mediaType={mediaType} onSelect={onSelect} />
    </div>
  );
};
