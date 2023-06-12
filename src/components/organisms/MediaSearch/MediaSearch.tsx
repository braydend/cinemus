import { type FC, useState } from "react";
import { type MediaType } from "../../../types";
import { MediaTypeSelector } from "../../atoms";
import { SearchBox } from "../../molecules";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../../server/api/root";
import { type ArrayElement } from "../../../utils/types";

type List = inferRouterOutputs<AppRouter>["listRouter"]["getList"];
type Media = ArrayElement<List>;

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
    <div className="md: flex w-full flex-col gap-2 md:flex-row">
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
