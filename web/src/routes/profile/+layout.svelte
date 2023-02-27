<script>
    import {onMount} from "svelte";
    import {configureClient, handleCallback} from "../../lib/auth";
    import {page} from "$app/stores";


    onMount(async() => {
        await configureClient()
        const isAuthRedirect = $page.url.searchParams.has('code') && $page.url.searchParams.has('state');

        if (isAuthRedirect) {
            await handleCallback()
        }
    });
</script>
<slot />
