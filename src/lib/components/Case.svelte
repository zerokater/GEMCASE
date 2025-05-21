<script lang="ts">
  export let caseData: {
    id: string;
    name: string;
    price: number;
    category: string;
    slug?: string;
    image_url?: string;
  };
  export let skins: {
    skins?: {
      image_url: string;
      name: string;
      price: number;
    };
    image_url?: string;
    name?: string;
    price?: number;
  }[] = [];

  let hover = false;
</script>

<a
  href={`/cases/${caseData.slug}`}
  style="text-decoration:none;color:inherit;"
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
>
  <article>
    <div class="case-header">
      <h3>{caseData.name}</h3>
      <span class="case-category">{caseData.category}</span>
    </div>
    <div class="case-image-preview">
      {#if !hover}
        <img
          class="case-img"
          src={caseData.image_url || '/default-case.png'}
          alt={caseData.name}
        />
      {:else if skins[0]}
        <img
          class="skin-img"
          src={skins[0].skins?.image_url ?? skins[0].image_url}
          alt={skins[0].skins?.name ?? skins[0].name}
          title={skins[0].skins?.name ?? skins[0].name}
        />
      {/if}
    </div>
    <div class="case-footer">
      <span class="case-price">{caseData.price.toFixed(2)} gems</span>
    </div>
  </article>
</a>


<style>
  article{
    padding: 24px;
    background-color: var(--darkgrey);
    border-radius: 8px;
  }
</style>