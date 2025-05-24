<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import { browser } from '$app/environment';

  export let case_skins;
  export let kase;
  export let steamid;

  const dispatch = createEventDispatcher();

  const VISIBLE_COUNT = 100;
  const WINNER_OFFSET_FROM_END = 6;
  const SKIN_WIDTH = 140;
  const SKIN_GAP = 24;
  const SPIN_DURATION = 6000;
  const ALIGN_DURATION = 360;
  const SPIN_EASE = 'cubic-bezier(.12,1,.39,1)';
  const ALIGN_EASE = 'cubic-bezier(.38,1.31,.4,1)';
  const OFFSET_RATIO = 0.95;

  let windowWidth;
  let CENTER_POSITION;
  let CENTER_OFFSET;
  let WINNER_POSITION;
  $: windowWidth = VISIBLE_COUNT * SKIN_WIDTH + (VISIBLE_COUNT - 1) * SKIN_GAP;
  $: CENTER_POSITION = Math.floor(VISIBLE_COUNT / 2);
  $: CENTER_OFFSET = VISIBLE_COUNT % 2 === 0 ? -((SKIN_WIDTH + SKIN_GAP) / 2) : 0;
  $: WINNER_POSITION = VISIBLE_COUNT - WINNER_OFFSET_FROM_END;

  let allSkins = case_skins.map(s => s.skins);
  let stripSkins = [];
  let stripRef;
  let mainOffset = 0;
  let alignActive = false;

  let currentWinner = null;

  export async function spin(winnerFromServer) {
    if (!winnerFromServer) return;
    currentWinner = winnerFromServer;

    initStrip();
    dispatch('spinStart');
    await tick();

    if (stripRef) {
      stripRef.style.transition = 'none';
      stripRef.style.transform = `translateX(0px)`;
    }

    mainOffset = (Math.random() * 2 - 1) * OFFSET_RATIO * (SKIN_WIDTH + SKIN_GAP) * 0.5;

    let tempStrip = [];
    for (let i = 0; i < WINNER_POSITION; i++)
      tempStrip.push(allSkins[Math.floor(Math.random() * allSkins.length)]);
    tempStrip.push(currentWinner);
    for (let i = WINNER_POSITION + 1; i < VISIBLE_COUNT; i++)
      tempStrip.push(allSkins[Math.floor(Math.random() * allSkins.length)]);
    stripSkins = tempStrip;

    await tick();

    const move = -((SKIN_WIDTH + SKIN_GAP) * (WINNER_POSITION - CENTER_POSITION)) + mainOffset + CENTER_OFFSET;

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        if (stripRef) {
          stripRef.style.transition = `transform ${SPIN_DURATION}ms ${SPIN_EASE}`;
          stripRef.style.transform = `translateX(${move}px)`;
        }
      });

      setTimeout(() => {
        alignActive = true;
        if (stripRef) {
          stripRef.style.transition = `transform ${ALIGN_DURATION}ms ${ALIGN_EASE}`;
          stripRef.style.transform = `translateX(${move - mainOffset}px)`;
        }

        setTimeout(() => {
          alignActive = false;
          dispatch('spinEnd', { winner: currentWinner });
          resolve();
        }, ALIGN_DURATION + 60);
      }, SPIN_DURATION + 40);
    });
  }

  function initStrip() {
    stripSkins = Array.from({ length: VISIBLE_COUNT }, () =>
      allSkins[Math.floor(Math.random() * allSkins.length)]
    );
    mainOffset = 0;
    alignActive = false;
    tick().then(() => {
      if (stripRef) {
        stripRef.style.transition = 'none';
        stripRef.style.transform = `translateX(${CENTER_OFFSET}px)`;
      }
    });
  }

  function getSkinCategory(skinId) {
    const entry = case_skins.find(cs => cs.skins.id === skinId);
    if (!entry) return 'normal';
    if (entry.gem_eligible) return 'gem';
    if (entry.profitable) return 'profitable';
    return 'not-profitable';
  }

  if (browser) initStrip();
</script>

{#if browser}
<main>
  <section>
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
    </div>
  </section>
</main>
{/if}




<style>
  /* identico a prima */
  main {
    width: 100%;
  }
  section {
    width: 100%;
    background-color: var(--dark);
    height: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
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
    background: radial-gradient(circle, rgb(179, 179, 179) 0%, transparent 90%);
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
  .skin.gem { }
  .skin.profitable { }
  .skin.not-profitable { }

  .skin img {
    width: 140px;
  }
</style>
