<script lang="ts">
  import Case from '$lib/components/Case.svelte';

  type CaseData = {
    id: string;
    name: string;
    price: number;
    category: string;
    slug?: string;
    image_url?: string;
  };

  export let data: {
    cases: CaseData[];
    rarestSkinByCase: Record<string, any[]>;
  };

  const { cases, rarestSkinByCase } = data;
</script>

<main>
  <header></header>
  <section>
    {#each cases as kase}
      <Case caseData={kase} skins={rarestSkinByCase[kase.id]} />
    {/each}
  </section>
</main>

<style>
  main {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  header {
    width: 100%;
    height: 400px;
    background-color: var(--darkgrey);
    border-radius: 8px;
  }



  section {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, auto);
    gap: 24px;
  }

  
</style>
