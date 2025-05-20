<script lang="ts">
  import type { LayoutData } from './$types';
  import NavGuest from '$lib/components/NavGuest.svelte';
  import NavUser from '$lib/components/NavUser.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import CompleteProfileModal from '$lib/components/CompleteProfileModal.svelte';
  import { supabase } from '$lib/supabaseClient';
  import "../app.css";
  export let data: LayoutData;

  let showModal = false;

  $: if (data.steamid) {
    checkUser();
  }

  async function checkUser() {
    if (!data.steamid) return;
    const { data: user } = await supabase
      .from('users')
      .select('steamid')
      .eq('steamid', data.steamid)
      .single();
    showModal = !user;
  }

  function closeModal() {
    showModal = false;
    location.reload();
  }
</script>

{#if data.steamid}
  {#if showModal}
    <CompleteProfileModal steamid={data.steamid} onComplete={closeModal} />
  {/if}
  <NavUser steamid={data.steamid} />
  <a href="/steam/logout">
    <button>Log out</button>
  </a>
{:else}
  <NavGuest />
  <p>No SteamID found (not logged in)</p>
{/if}

<slot />
<Footer />
