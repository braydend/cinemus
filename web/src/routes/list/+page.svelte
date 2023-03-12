<script lang="ts">
    import { authToken } from "../../lib/auth";
    import debounce from "lodash.debounce"
    import {searchMovies, searchShows} from "../../lib/queries/search";
    import type { MediaResponse } from "../../lib/queries/search";
    import type {Media} from "../../lib/types";
    import {getList, getMovie, getShow, updateList} from "../../lib/queries/list";
    import type {Movie, Show} from "../../lib/queries/list"
    import {onMount} from "svelte";

    type MediaType = "movie" | "show"

    let mediaType: MediaType = "movie"
    let query = ""
    let selections: Media[] = []
    let updateListPromise


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

    // Get list when user is authed
    $: if ($authToken) {
        // Update this to use real name when API is updated
        (async () => {
            const media = (await getList($authToken)).data;
            for (const {id, __type} of media) {
                if (__type === "movie"){
                    getMovie($authToken, id).then(data => data.movie)
                }
                if (__type === "show"){
                    getShow($authToken, id).then(data => data.show)
                }
            }
        })()
        // (async() => {selections = (await getList($authToken)).data.mediaIds.map(id => ({name: `foo-${id}`, id}))})()
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
                {#each response.results as { id: id, title: name }}
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
