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

  let allSkins = data.case_skins.map(s => s.skins);

  // Config
  const VISIBLE_COUNT = 25;
  const SKIN_WIDTH = 140;
  const SKIN_GAP = 24;
  const SPIN_DISTANCE = 14; // how many positions to move left per spin
  const ANIMATION_DURATION = 2000;
  const centerPos = Math.floor(VISIBLE_COUNT / 2);

  $: windowWidth = (SKIN_WIDTH + SKIN_GAP) * VISIBLE_COUNT - SKIN_GAP;

  let stripSkins = [];
  let winner = null;
  let winnerIndex = -1;
  let spinning = false;
  let translateX = 0;

  // Helper to pick a winner with chance
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

  // Fill window with randoms for idle state
  function initStrip() {
    stripSkins = Array.from({ length: VISIBLE_COUNT }, () =>
      allSkins[Math.floor(Math.random() * allSkins.length)]
    );
    winner = null;
    winnerIndex = -1;
    translateX = 0;
  }
  initStrip();

  async function spin() {
    if (spinning) return;
    spinning = true;

    // 1. Winner
    winner = pickWinner();

    // 2. Build new strip: [left randoms] [winner] [right randoms]
    // Always spin through SPIN_DISTANCE cards before winner lands in center
    const before = SPIN_DISTANCE + centerPos;
    const after = VISIBLE_COUNT - centerPos - 1;
    let tempStrip = [];
    for (let i = 0; i < before; i++) tempStrip.push(allSkins[Math.floor(Math.random() * allSkins.length)]);
    tempStrip.push(winner);
    for (let i = 0; i < after; i++) tempStrip.push(allSkins[Math.floor(Math.random() * allSkins.length)]);
    stripSkins = tempStrip;
    winnerIndex = before; // winner index in strip

    // 3. Set up animation
    const stripEl = document.querySelector('.strip');
    translateX = 0;
    stripEl.style.transition = 'none';
    stripEl.style.transform = `translateX(0px)`;
    await tick();

    // 4. Animate the strip so winner lands at center
    translateX = -((SKIN_WIDTH + SKIN_GAP) * (winnerIndex - centerPos));
    requestAnimationFrame(() => {
      stripEl.style.transition = `transform ${ANIMATION_DURATION}ms cubic-bezier(.23,1.02,.43,.99)`;
      stripEl.style.transform = `translateX(${translateX}px)`;
    });

    // 5. After animation, show just the window, winner centered
    setTimeout(() => {
      // The winner is now at centerPos, show only [centerPos-(centerPos), ..., centerPos+(VISIBLE_COUNT-centerPos-1)]
      const start = winnerIndex - centerPos;
      stripSkins = stripSkins.slice(start, start + VISIBLE_COUNT);
      winnerIndex = centerPos;
      stripEl.style.transition = 'none';
      stripEl.style.transform = `translateX(0px)`;
      spinning = false;
    }, ANIMATION_DURATION + 50);
  }
</script>

<main>
  <section>
    <div class="center-line" style="left: 50%;"></div>
    <div class="strip-window" style="width: {windowWidth}px;">
      <div class="strip">
        {#each stripSkins as skin, i}
          <div class="skin {winner && i === winnerIndex ? 'winner' : ''}">
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
    transition: transform 0.2s;
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
