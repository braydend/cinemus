interface ListedMedia {
  id: string;
  __type: "movie" | "show";
}

export interface List {
  userId: string;
  media: ListedMedia[];
}
