import { type FC, useState } from "react";
import { type Media, type MediaType } from "../../../types";
import { MediaTypeSelector } from "../../atoms";
import { SearchBox } from "../../molecules";

interface Props {
  onSelect: (selection: Media) => void;
}

export const MediaSearch: FC<Props> = ({ onSelect }) => {
  const [mediaType, setMediaType] = useState<MediaType>("show");
  const [query, setQuery] = useState("");

  const handleMediaTypeChange = (value: MediaType): void => {
    setMediaType(value);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md: w-full">
      <MediaTypeSelector value={mediaType} onChange={handleMediaTypeChange} />
      <SearchBox
        mediaType={mediaType}
        onSelect={onSelect}
        query={query}
        setQuery={setQuery}
      />
    </div>
  );
};