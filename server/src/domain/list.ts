type ListedMedia = {
    id: string,
    __type: "movie" | "show"
};

type List = {
    userId: string,
    media: ListedMedia[],
}