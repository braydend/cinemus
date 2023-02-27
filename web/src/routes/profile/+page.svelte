<script>
    import {userInfo, login, logout} from "../../lib/auth";
</script>

<header>
    <nav>
        {#if $userInfo}
            <p>Welcome, {$userInfo.name}!</p>
            <button on:click={logout}>Logout</button>
        {:else}
            <button on:click={login}>Login</button>
        {/if}
    </nav>
</header>

<main>
    <slot></slot>
</main>
