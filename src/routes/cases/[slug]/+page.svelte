<script lang="ts">
  import { onMount } from 'svelte';
  import SpinWindow from '$lib/components/SpinWindow.svelte';
  import { gems } from '$lib/gemsStore';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';

  export let data;

  let spinning = false;
  let winner = null;
  let spinWindowRef;
  let localGems = 0;
  let rerollKey = 0; // Forces rerender even if same skin

  gems.subscribe(val => localGems = val);

  async function openCase() {
    if (spinning) return;
    spinning = true;

    // Reset reroll key so even same skin gets rerendered
    rerollKey = Math.random();

    const res = await fetch('/api/open-case', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: get(page).params.slug })
    });

    const result = await res.json();

    if (!res.ok || !result.skin) {
      spinning = false;
      return alert(result.error || 'Failed to open case');
    }

    winner = result.skin;
    gems.set(result.gems);

    await spinWindowRef.spin(result.skin);
    spinning = false;
  }

  async function sellSkin() {
    if (!winner || spinning) return;

    const res = await fetch('/api/sell-skin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skin_id: winner.id })
    });

    const result = await res.json();
    if (!res.ok) return alert(result.error || 'Failed to sell skin');

    gems.set(result.gems);
    winner = null;
  }
</script>




<main>
  <section>
    <SpinWindow
      bind:this={spinWindowRef}
      case_skins={data.case_skins}
      kase={data.kase}
      steamid={data.steamid}
      key={rerollKey} 
    />
  </section>
  
    <div class="case-info">
      <div class="case-name">
        <h1>{data.kase.name}</h1>
        <div>{data.kase.category}</div>
      </div>
      <div class="cta">
        <button class=" btn open-btn" on:click={openCase} disabled={spinning}>
          {#if spinning}
            Opening...
          {:else}
            Open for <img src="/img/gem-black.svg" alt="Gem" style="width: 11px; display: inline-block; vertical-align: middle; margin: 0px 4px; margin-bottom: 2px;" /> {data.kase.price}
          {/if}
        </button>
        {#if winner && !spinning}
          <button class="btn close-btn" on:click={sellSkin}>
            Sell for <img src="/img/gem.svg" alt="Gem" style="width: 11px; display: inline-block; vertical-align: middle; margin: 0px 4px; margin-bottom: 2px;" /> {winner.price} 
          </button>
        {/if}
      </div>
    </div>

</main>




<style>

  .case-info{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
  }

  main{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 100%));
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;

    
  }


  .cta{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }

  section{
    
    width: 100%;
  }


  .case-name{
    display: none;
  }
  .btn{
    cursor: pointer;
          padding: 10px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      color: var(--background);
      font-weight: 600;
      gap: 12px;
      border-radius: 4px;
      border: none;
      display: block;
      transition: all 0.2s;
  }
  .btn:hover{
    opacity: 0.5;
  }

  .open-btn{
    background-color: var(--accent);
  }

  .close-btn{
    background-color: var(--dark);
    color: white;
  }

  @media only screen and (max-width: 1150px) {
  main {
    padding: 0px 14px;
    width: 100%;
  }
}
</style>