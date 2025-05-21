<script lang="ts">
  import { tick } from 'svelte';
  import { scale } from 'svelte/transition';

  export let data: {
    case_skins: {
      skins: {
        id: string;
        weapon: string;
        skin: string;
        image_url: string;
        price: number;
      };
      chance: number;
      gem_eligible?: boolean;
      profitable?: boolean;
    }[];
    kase: { price: number; };
  };

  // ==== CONFIG ====
  const VISIBLE_COUNT = 100;
  const WINNER_OFFSET_FROM_END = 6;
  const SKIN_WIDTH = 140;
  const SKIN_GAP = 24;
  let SPIN_DURATION = 6000;
  let ALIGN_DURATION = 360;
  const SPIN_EASE = 'cubic-bezier(.12,1,.39,1)';
  const ALIGN_EASE = 'cubic-bezier(.38,1.31,.4,1)';
  const OFFSET_RATIO = 0.95;

  // ==== MATH ====
  $: windowWidth = (SKIN_WIDTH + SKIN_GAP) * VISIBLE_COUNT - SKIN_GAP;
  $: CENTER_POSITION = Math.floor(VISIBLE_COUNT / 2);
  $: CENTER_OFFSET = VISIBLE_COUNT % 2 === 0
    ? -((SKIN_WIDTH + SKIN_GAP) / 2)
    : 0;
  $: WINNER_POSITION = VISIBLE_COUNT - WINNER_OFFSET_FROM_END;

  // ==== STATE ====
  let allSkins = data.case_skins.map(s => s.skins);
  let stripSkins = [];
  let winner = null;
  let spinning = false;
  let stripRef;
  let mainOffset = 0;
  let alignActive = false;
  let showModal = false; // for modal state

  // === CATEGORY COLOR LOGIC ===
  function getSkinCategory(skinId: string) {
    const entry = data.case_skins.find(cs => cs.skins.id === skinId);
    if (!entry) return 'normal';
    if (entry.gem_eligible) return 'gem';
    if (entry.profitable) return 'profitable';
    return 'not-profitable';
  }

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
    showModal = false;
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
    showModal = false; // close modal if open
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

    // Animate so winner lands under center line (with even/odd fix!)
    const move = -((SKIN_WIDTH + SKIN_GAP) * (WINNER_POSITION - CENTER_POSITION)) + mainOffset + CENTER_OFFSET;
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
        showModal = true; // show the modal after spin completes
      }, ALIGN_DURATION + 60);
    }, SPIN_DURATION + 40);
  }

  function sellSkin() {
    showModal = false;
    // ...do your sell logic here (API, supabase etc)
  }
</script>

<main>
  <section>
    {#if showModal && winner}
      <div class="modal-bg" />
    {/if}
    <div class="center-line" style="left: 50%;"></div>
    <div class="strip-window" style="width: {windowWidth}px;">
      <div class="strip" bind:this={stripRef}>
        {#each stripSkins as skin, i}
          <div
            class="skin {i === WINNER_POSITION ? 'highlight' : ''} {getSkinCategory(skin.id)}"
          >
            <img src={skin.image_url} alt={skin.weapon} />
            <div>{skin.weapon}</div>
            <div style="font-size: 0.93em; color:#bbb;">{skin.skin}</div>
          </div>
        {/each}
      </div>
      {#if winner && !spinning && showModal}
        <div
          class="result-modal"
          in:scale={{ duration: 320, start: 0.8 }}
        >
          <img src={winner.image_url} alt={winner.weapon} />
          <div style="font-size:1em;"><b>{winner.weapon}</b></div>
          <div style="color:#aaa; margin-bottom:2px;">{winner.skin}</div>
          <button class="sell-btn" on:click={sellSkin}>
            Sell for {winner.price} gems
          </button>
        </div>
      {/if}
    </div>
  </section>
  <button class="spin-btn" on:click={spin} disabled={spinning}>
    {spinning ? `Opening...` : `Open for ${data.kase.price} gems`}
  </button>
</main>

<style>
  main {
    width: 1200px;
    margin: 0 auto;
  }
  section {
    width: 100%;
    background-color: var(--dark);
    border: 1pt solid var(--accent);
    height: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
  }
  .modal-bg {
    position: absolute;
    z-index: 19;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(20, 22, 28, 0.25);
    backdrop-filter: blur(6px);
    pointer-events: auto;
    transition: background 0.2s;
  }
  .center-line{
    height: 100%;
    width: 2px;
    position: absolute;
    z-index: 2;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    opacity: 0.9;
    background: radial-gradient(circle, var(--border) 0%, transparent 80%);
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
    padding: 12px;
  }
  .skin.highlight {
    opacity: 1;
    z-index: 2;
  }
  /* Category coloring */
  .skin.gem { }
  .skin.profitable { }
  .skin.not-profitable { }
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
  .result-modal {
    position: absolute;
    left: 50%;
    top: 53%;
    transform: translate(-50%, -50%);
    background: #181c1faa;
    padding: 14px 16px;
    border-radius: 13px;
    z-index: 20;
    text-align: center;
    color: #fff;
    box-shadow: 0 8px 36px #0007, 0 2px 8px #0005;
    border: 2px solid var(--accent, #4bd865);
    min-width: 190px;
    max-width: 76vw;
    font-size: 0.96em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
  }
  .result-modal img {
    margin: 6px auto 4px auto;
    max-width: 65px;
    display: block;
    border-radius: 6px;
  }
  .sell-btn {
    margin: 0 auto;
    padding: 8px 20px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1em;
    background: var(--accent, #4bd865);
    color: #181c1f;
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 8px #0003;
    transition: background 0.2s;
    margin-top: 8px;
  }
  .sell-btn:hover {
    background: #24b047;
  }
  @media only screen and (max-width: 1100px) {
    main {
      width: 100%;
      padding: 0 12px;
    }
    .strip-window {
      max-width: 100vw;
    }
    .result-modal {
      padding: 10px 1vw;
      min-width: unset;
      font-size: 0.95em;
    }
  }
</style>
