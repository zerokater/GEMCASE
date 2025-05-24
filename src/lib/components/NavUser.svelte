<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { gems } from '$lib/gemsStore';
  import { tick } from 'svelte';
  export let steamid: string;

  let animate = false;
  let lastGems: number | null = null;

  $: if (steamid) loadGems();

  async function loadGems() {
    const { data: user } = await supabase
      .from('users')
      .select('gems')
      .eq('steamid', steamid)
      .single();
    gems.set(user?.gems !== undefined && user?.gems !== null ? parseFloat(user.gems) : 0);
  }

  // Animation trigger on gems change
  $: {
    if ($gems !== null && lastGems !== null && $gems !== lastGems) {
      triggerAnimation();
    }
    lastGems = $gems;
  }

  async function triggerAnimation() {
    animate = false;
    await tick();
    animate = true;
    setTimeout(() => {
      animate = false;
    }, 420);
  }
</script>

<nav>
  <div class="container">
    <a href="/">
      <img class="logo-icon" src="/img/gem.svg" alt="gem logo">
      <img class="logo" src="/img/gemcase-logo.svg" alt="gemcase logo" />
    </a>
    <div class="menu">
      <div class="gems">
        <a class="deposit" href="/">
          <p>DEPOSIT</p>
        </a>
        <div class="balance">
          <img src="/img/gem.svg" alt="gems icon" />
          <p class:pop-animate={animate}>
            {$gems === null ? '...' : $gems.toFixed(2)}
          </p>
        </div>
      </div>
      <a class="linkstyle inv" href="/">
        <img src="/img/inventory.svg" alt="inventory icon" />
        <div class="items"></div>
      </a>
      <a class="linkstyle" href="/">
        <img src="/img/user.svg" alt="user icon" />
      </a>
      <a class="logout-btn" href="/steam/logout">
        <button>Log out</button>
      </a>
    </div>
  </div>
</nav>

<style>
  .menu{
      display: flex;
      flex-direction: row;
      gap: 12px;
  }

  .gems{
      display: flex;
  }


  .deposit{
      padding: 10px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: var(--accent);
      color: var(--background);
      font-weight: 600;
      gap: 12px;
      border-radius: 4px 0px 0px 4px;
  }

  .balance{
      padding: 10px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: var(--background);
      gap: 12px;
      border-radius: 0px 4px 4px 0px;
  }

  .balance img{
      width: 8px;
  }

  .balance p {
      transition: transform 0.18s;
      will-change: transform;
  }
  .balance p.pop-animate {
      animation: pop-gems 0.42s cubic-bezier(0.2,1.6,0.4,1);
  }
  @keyframes pop-gems {
      0%   { transform: scale(1); }
      30%  { transform: scale(1.33); }
      55%  { transform: scale(0.97); }
      70%  { transform: scale(1.06);}
      100% { transform: scale(1);}
  }

  .linkstyle{
      padding: 10px;
      background-color: var(--background);
      border-radius: 4px;
      position: relative;
  }

  .linkstyle img{
      display: block;
  }

  .items{
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--accent);
      transform: translate(50%, -50%);
      width: 12px;
      height: 12px;
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: 600;
  }

  .container{
      border-radius: 8px;
      padding: 14px;
      background-color: var(--darkgrey);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
  }

  .logo{
      display: block;
      width: 220px;
  }

  nav{
      padding: 24px 0px 24px 0px;
      width: 1200px;
      margin: 0 auto;
  }


.logout-btn{
  display: none;
}

  .logout-btn button {
    background-color: var(--background);
    color: var(--grey);
    font-weight: 600;
    border: none;
    border-radius: 6px;
    padding: 8px 24px;
    cursor: pointer;
    font-size: 15px;
    margin-left: 12px;
    transition: background 0.2s;
    display: none;
  }

  .logo-icon{
    display: none;
  }

  @media only screen and (max-width: 1150px) {
  nav {
    padding: 14px 14px;
    width: 100%;
  }

  .logo{
    display: none;
  }

  .logo-icon{
    display: block;
    width: 20px;
  }
}

</style>
