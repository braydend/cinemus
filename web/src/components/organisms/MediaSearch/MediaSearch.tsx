import { type FC, useState } from "react";
import { type MediaType } from "../../../types";
import { MediaTypeSelector } from "../../atoms";
import { SearchBox } from "../../molecules";
import { type MediaResponse } from "../../../queries/search";

interface Props {
  onSelect: (selection: MediaResponse) => void;
}

export const MediaSearch: FC<Props> = ({ onSelect }) => {
  const [mediaType, setMediaType] = useState<MediaType>("show");
  const [query, setQuery] = useState("");

  const handleMediaTypeChange = (value: MediaType): void => {
    setMediaType(value);
  };

  return (
    <div>
      <MediaTypeSelector onChange={handleMediaTypeChange} />
      <SearchBox
        mediaType={mediaType}
        onSelect={onSelect}
        query={query}
        setQuery={setQuery}
      />
    </div>
  );
};