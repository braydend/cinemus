<script>
    import {userInfo, login, logout, authToken} from "../../lib/auth";
    import {endpoints} from "../../lib/config";

    const findMovie = () => fetch(
        `${endpoints.lambdaBase}/findMovie?query=pirate`,
        {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${$authToken}`
            }
        }
    ).then(( data ) => data.json().then(console.log)).catch(console.error)
</script>

<header>
    <nav>
        {#if $userInfo}
            <p>Welcome, {$userInfo.name}!</p>
            <button on:click={logout}>Logout</button>
            <button on:click={findMovie}>Call API</button>
        {:else}
            <button on:click={login}>Login</button>
        {/if}
    </nav>
</header>

<main>
    <slot></slot>
</main>
