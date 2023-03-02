<script lang="ts">
    import { authToken } from "../../lib/auth";
    import debounce from "lodash.debounce"
    import {searchMovie, searchShow} from "../../lib/queries/search";
    import type { MediaResponse } from "../../lib/queries/search";
    import type {Media} from "../../lib/types";

    type MediaType = "movie" | "show"

    let mediaType: MediaType = "movie"
    let query = ""
    let selections: Media[] = []

    let promise

    const addSelection = (selection: Media) => {
        if (!Boolean(selections.find(({ id }) => id === selection.id))) {
            selections = [...selections, selection]
        }
    };

    const removeSelection = (selectionId: Media["id"]) => {
        selections = selections.filter(({ id }) => id !== selectionId)
    };

    const search = async (type: MediaType): Promise<MediaResponse> => {
        if (type === "movie") return await searchMovie(query, $authToken)
        if (type === "show") return await searchShow(query, $authToken)
    }

    // Research if type is changed
    $: if (mediaType && query.length > 0) {
        promise = search(mediaType)
    }

    const handleInput = debounce(
        () => { promise = search(mediaType) }
        , 1000);
</script>
<main>
    <label for="movie">Movie</label>
    <input name="media-type" type="radio" id="movie" value="movie" checked bind:group={mediaType} />
    <label for="show">TV</label>
    <input name="media-type" type="radio" id="show" value="show" bind:group={mediaType} />
    <input type="text" bind:value={query} on:input={handleInput} />

    {#if promise}
        {#await promise}
            <div>searching</div>
            {:then response}
            <ul>
                {#each response as { Id: id, Name: name }}
                    <li on:click={() => addSelection({id, name})}>{name}</li>
                {/each}
            </ul>
            {:catch e}
            <div>Error {e}</div>
        {/await}
    {/if}

    <h1>List</h1>
    <ul>
        {#each selections as {id, name}}
            <li on:click={() => removeSelection(id)}>{name}</li>
        {/each}
    </ul>
</main>
