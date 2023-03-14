import {useMutation, useQuery } from "@tanstack/react-query";
import {ChangeEventHandler, FC, ReactEventHandler, useEffect, useState } from "react"
import {Media} from "../../types";
import {searchMovies, searchShows} from "../../queries/search";
import {useGetAuthToken} from "../../hooks/useGetAuthToken";
import {getList, updateList} from "../../queries/list";
import {useDebounce} from "use-debounce"


export const MediaList: FC = () => {
    const {authToken} = useGetAuthToken()
    const {data: initialList, isLoading} = useQuery(["getList"], () => getList(authToken), {enabled: Boolean(authToken)})
    const {mutate, data: selections} = useMutation(["updateList"], (media: Omit<Media, "title">[]) => updateList(media.map(({id, __type}) => ({id: `${id}`, __type})), authToken))

    const currentSelections = selections?.data ?? initialList?.data ?? []
    const handleSelection = (media: Media) => {
        mutate([...currentSelections, media])
    };

    const handleRemoval = (media: Media) => {
        mutate(currentSelections.filter(selection => selection !== media))
    };

    return (
        <div>
            <h1>List</h1>
            {isLoading ? (
                <>Loading list...</>
            ) : (
                <>
                    <Search onSelect={handleSelection} />
                    <List media={currentSelections} onSelect={handleRemoval} />
                </>
            )}
        </div>
    )
};

type SearchProps = {
    onSelect: (selection: Media) => void;
};

const Search: FC<SearchProps> = ({onSelect}) => {
    const {authToken} = useGetAuthToken()
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 500)
    const [mediaType, setMediaType] = useState<"movie"|"show">("movie");
    const { data, isLoading, } = useQuery([`search-${mediaType}-${query}`],() => mediaType === "movie" ? searchMovies(debouncedQuery, authToken) : searchShows(debouncedQuery, authToken), {enabled: Boolean(authToken) && Boolean(debouncedQuery)})

    const handleMediaTypeChange: ChangeEventHandler<HTMLInputElement> = ({target: { value }}) => {
        setMediaType(value as "movie"|"show")
    }

    const handleQueryChange:ChangeEventHandler<HTMLInputElement> = ({ target: { value}}) => {
        setQuery(value)
    };

    return (
        <div>
            <input type="text" onChange={handleQueryChange} />
            <label htmlFor="tv">TV Show</label>
            <input type="radio" value="show" name="mediaType" id="tv" onChange={handleMediaTypeChange} defaultChecked/>
            <label htmlFor="movie">Movie</label>
            <input type="radio" value="movie" name="mediaType" id="movie" onChange={handleMediaTypeChange}/>
            <ul>
                {data?.results.map((media) => (
                    <li key={`${media.id}-${media.__type}`}
                        onClick={() => {
                            onSelect(media)
                        }
                    }>{media.title}</li>
                ))}
            </ul>
        </div>
    );
};

type ListProps = {media: Media[], onSelect: (selection: Media) => void}

const List: FC<ListProps> = ({media, onSelect}) => {
    return <ul>
        {media.map((m) => <li key={`${m.id}-${m.__type}`} onClick={() => onSelect(m)}>{m.title}</li>)}
    </ul>
};