<main>
  <div class="play">
    <section class="case-info">
    </section>
    <section class="spin-window">
    </section>
  </div>

  <section class="skins">
  </section>
</main>

<style>
  main{
    width: 1200px;
    margin: 0 auto;
  }

  .play{
    height: 400px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 24px;
  }

  .case-info{
    border-radius: 8px;
    background-color: var(--darkgrey);
    padding: 24px;
  }

  .spin-window{
    border-radius: 8px;
    background-color: var(--dark);
    padding: 24px;
    border: 1pt solid var(--border);
  }

  .skins{
  }
</style>