<script lang="ts">
  import { tick } from 'svelte';

  export let data: {
    case_skins: {
      skins: {
        id: string;
        name: string;
        image_url: string;
        price: number;
      };
      chance: number;
    }[];
    kase: any;
  };

  // ---- CONFIG ----
  const VISIBLE_COUNT = 35;      // Try any value >=10
  const SKIN_WIDTH = 140;
  const SKIN_GAP = 24;
  const WINNER_POSITION = VISIBLE_COUNT - 6; // Winner is 6 before the end
  const SPIN_DURATION = 4000;
  const ALIGN_DURATION = 360;
  const SPIN_EASE = 'cubic-bezier(.15,.86,.47,1)';
  const ALIGN_EASE = 'cubic-bezier(.38,1.31,.4,1)';
  const OFFSET_RATIO = 0.8;

  // ---- INTERNAL STATE ----
  let allSkins = data.case_skins.map(s => s.skins);
  $: windowWidth = (SKIN_WIDTH + SKIN_GAP) * VISIBLE_COUNT - SKIN_GAP;
  $: CENTER_POSITION = Math.floor(VISIBLE_COUNT / 2);

  let stripSkins = [];
  let winner = null;
  let spinning = false;
  let stripRef;
  let mainOffset = 0;
  let alignActive = false;

  function pickWinner() {
    let total = data.case_skins.reduce((sum, s) => sum + s.chance, 0);
    let rand = Math.random() * total;
    let accum = 0;
    for (let i = 0; i < data.case_skins.length; i++) {
      accum += data.case_skins[i].chance;
      if (rand <= accum) {
        return data.case_skins[i].skins;
      }
    }
    return allSkins[allSkins.length - 1];
  }

  function initStrip() {
    stripSkins = Array.from({ length: VISIBLE_COUNT }, () =>
      allSkins[Math.floor(Math.random() * allSkins.length)]
    );
    winner = null;
    mainOffset = 0;
    alignActive = false;
    tick().then(() => {
      if (stripRef) {
        stripRef.style.transition = 'none';
        stripRef.style.transform = `translateX(0px)`;
      }
    });
  }
  initStrip();

  async function spin() {
    if (spinning) return;
    spinning = true;
    alignActive = false;

    winner = pickWinner();

    // Offset: random -0.8 ... +0.8 of a skin width
    mainOffset = (Math.random() * 2 - 1) * OFFSET_RATIO * (SKIN_WIDTH + SKIN_GAP) * 0.5;

    // Build new strip with winner at WINNER_POSITION
    let tempStrip = [];
    for (let i = 0; i < WINNER_POSITION; i++)
      tempStrip.push(allSkins[Math.floor(Math.random() * allSkins.length)]);
    tempStrip.push(winner);
    for (let i = WINNER_POSITION + 1; i < VISIBLE_COUNT; i++)
      tempStrip.push(allSkins[Math.floor(Math.random() * allSkins.length)]);
    stripSkins = tempStrip;

    await tick();

    // Reset transform instantly
    if (stripRef) {
      stripRef.style.transition = 'none';
      stripRef.style.transform = `translateX(0px)`;
    }

    // Animate so winner lands under center line
    const move = -((SKIN_WIDTH + SKIN_GAP) * (WINNER_POSITION - CENTER_POSITION)) + mainOffset;
    requestAnimationFrame(() => {
      if (stripRef) {
        stripRef.style.transition = `transform ${SPIN_DURATION}ms ${SPIN_EASE}`;
        stripRef.style.transform = `translateX(${move}px)`;
      }
    });

    // Second align animation to perfect center
    setTimeout(() => {
      alignActive = true;
      if (stripRef) {
        stripRef.style.transition = `transform ${ALIGN_DURATION}ms ${ALIGN_EASE}`;
        stripRef.style.transform = `translateX(${move - mainOffset}px)`;
      }
      setTimeout(() => {
        spinning = false;
        alignActive = false;
      }, ALIGN_DURATION + 60);
    }, SPIN_DURATION + 40);
  }
</script>

<main>
  <section>
    <div class="center-line" style="left: 50%;"></div>
    <div class="strip-window" style="width: {windowWidth}px;">
      <div class="strip" bind:this={stripRef}>
        {#each stripSkins as skin, i}
          <div class="skin {winner && i === WINNER_POSITION ? 'winner' : ''}">
            <img src={skin.image_url} alt={skin.name} />
            <div>{skin.name}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  <button class="spin-btn" on:click={spin} disabled={spinning}>
    {spinning ? "Spinning..." : "Spin"}
  </button>
  {#if winner && !spinning}
    <div class="result">
      <h3>You won:</h3>
      <img src={winner.image_url} alt={winner.name} />
      <div><b>{winner.name}</b> ({winner.price} coins)</div>
    </div>
  {/if}
</main>

<style>
  main {
    width: 1200px;
    margin: 0 auto;
  }
  section {
    width: 100%;
    background-color: var(--dark, #181a1b);
    height: 400px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
  }
  .center-line{
    height: 100%;
    background-color: var(--accent, #4bd865);
    width: 2px;
    position: absolute;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    opacity: 0.9;
  }
  .strip-window {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
    width: 100%;
    height: 100%;
    background: #e5eefe;
  }
  .strip {
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: center;
    height: 100%;
    will-change: transform;
  }
  .skin {
    border-radius: 6px;
    width: 140px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    background: #23272b;
    box-shadow: 0 1px 8px #0005;
  }
  .skin.winner {
    border: 3px solid #4bd865;
    box-shadow: 0 0 24px #41ffae, 0 1px 8px #0005;
    transform: scale(1.1);
    transition: all 0.2s;
    z-index: 5;
  }
  .skin img {
    width: 140px;
    margin-bottom: 8px;
    border-radius: 3px;
  }
  .spin-btn {
    margin: 24px auto 0 auto;
    display: block;
    background: var(--accent, #4bd865);
    color: #111;
    font-weight: bold;
    padding: 16px 48px;
    border: none;
    border-radius: 7px;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: 0 1px 8px #0004;
    transition: background 0.2s;
  }
  .spin-btn:disabled {
    background: #888;
    color: #222;
    cursor: not-allowed;
  }
  .spin-btn:hover:enabled {
    background: #24b047;
  }
  .result {
    margin: 32px auto 0 auto;
    background: #222a;
    padding: 24px 40px;
    border-radius: 12px;
    text-align: center;
    color: #fff;
    max-width: 340px;
    box-shadow: 0 4px 32px #0005;
  }
  .result img {
    margin: 14px auto;
    max-width: 90px;
    display: block;
    border-radius: 6px;
  }
  @media only screen and (max-width: 1100px) {
    main {
      width: 100%;
      padding: 0 12px;
    }
    .strip-window {
      max-width: 100vw;
    }
  }
</style>
