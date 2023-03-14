<script>
    import {userInfo, login, logout, authToken} from "../../lib/auth";
</script>

<header>
    <nav>
        {#if $userInfo}
            <p>Welcome, {$userInfo.name}! ({JSON.stringify($userInfo)})</p>
            <button on:click={logout}>Logout</button>
            <textarea>{$authToken}</textarea>
        {:else}
            <button on:click={login}>Login</button>
        {/if}
    </nav>
</header>

<main>
    <slot></slot>
</main>
