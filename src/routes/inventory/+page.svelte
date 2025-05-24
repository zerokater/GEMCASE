<script lang="ts">
  import { gems } from '$lib/gemsStore';

  export let data;
  let inventory = data.inventory;

  async function sellSkin(id, price) {
    const res = await fetch('/api/sell-skin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skin_id: id })
    });

    const result = await res.json();
    if (!res.ok) {
      alert(result.error || 'Failed to sell skin');
      return;
    }

    // Aggiorna localmente l'inventario
    inventory = inventory.filter(item => item.id !== id);
    gems.set(result.gems);
  }
</script>

<main class="inventory-container">
  <h1>Inventory</h1>

  {#if inventory.length === 0}
    <p>Your inventory is empty.</p>
  {:else}
    <div class="inventory-grid">
      {#each inventory as item}
        <div class="inventory-item">
          <img src={item.skins.image_url} alt={item.skins.weapon} />
          <h3>{item.skins.weapon}</h3>
          <p>{item.skins.skin}</p>
          <button class="sell-btn" on:click={() => sellSkin(item.id, item.skins.price)}>
            Sell for {item.skins.price.toFixed(2)} gems
          </button>
        </div>
      {/each}
    </div>
  {/if}
</main>

<style>
  .inventory-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  h1 {
    font-size: 32px;
    margin-bottom: 24px;
  }

  .inventory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 24px;
  }

  .inventory-item {
    background: var(--darkgrey);
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inventory-item img {
    width: 100%;
    border-radius: 4px;
  }

  .sell-btn {
    background-color: var(--accent);
    color: var(--background);
    border: none;
    border-radius: 4px;
    padding: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .sell-btn:hover {
    background-color: #cc1e38;
  }
</style>
