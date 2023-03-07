<script lang="ts">
    import { authToken } from "../../lib/auth";
    import debounce from "lodash.debounce"
    import {searchMovies, searchShows} from "../../lib/queries/search";
    import type { MediaResponse } from "../../lib/queries/search";
    import type {Media} from "../../lib/types";
    import {getList, updateList} from "../../lib/queries/list";
    import {onMount} from "svelte";

    type MediaType = "movie" | "show"

    let mediaType: MediaType = "movie"
    let query = ""
    let selections: Media[] = []
    let updateListPromise


    onMount(async () => {
        // Update this to use real name when API is updated
        selections = (await getList($authToken)).ids.map(id => ({name: `foo-${id}`, id}))
    });


    const addSelection = (selection: Media) => {
        if (!Boolean(selections.find(({ id }) => id === selection.id))) {
            selections = [...selections, selection]
            updateList(selections.map(({ id }) => id), $authToken)
        }
    };

    const removeSelection = (selectionId: Media["id"]) => {
        selections = selections.filter(({ id }) => id !== selectionId)
        updateList(selections.map(({ id }) => id), $authToken)
    };

    const search = async (type: MediaType): Promise<MediaResponse> => {
        if (type === "movie") return await searchMovies(query, $authToken)
        if (type === "show") return await searchShows(query, $authToken)
    }

    // Research if type is changed
    $: if (mediaType && query.length > 0) {
        updateListPromise = search(mediaType)
    }

    const handleInput = debounce(
        () => { updateListPromise = search(mediaType) }
        , 1000);
</script>
<main>
    <label for="movie">Movie</label>
    <input name="media-type" type="radio" id="movie" value="movie" checked bind:group={mediaType} />
    <label for="show">TV</label>
    <input name="media-type" type="radio" id="show" value="show" bind:group={mediaType} />
    <input type="text" bind:value={query} on:input={handleInput} />

    {#if updateListPromise}
        {#await updateListPromise}
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
