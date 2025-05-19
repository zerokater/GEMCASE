<script lang="ts">
  import type { LayoutData } from './$types';
  import NavGuest from '$lib/components/NavGuest.svelte';
  import NavUser from '$lib/components/NavUser.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import "../app.css";
  export let data: LayoutData;
</script>

{#if data.steamid}
  <NavUser steamid={data.steamid} />
  <p>SteamID: {data.steamid}</p>
  <a href="/steam/logout">
    <button>Log out</button>
  </a>
{:else}
  <NavGuest />
  <p>No SteamID found (not logged in)</p>
{/if}

<slot />

<Footer />
