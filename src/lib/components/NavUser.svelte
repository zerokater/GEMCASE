<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  export let steamid: string;

  let gems: number | null = null;

  $: if (steamid) {
    loadGems();
  }

  async function loadGems() {
    const { data: user, error } = await supabase
      .from('users')
      .select('gems')
      .eq('steamid', steamid)
      .single();

    gems = user?.gems ?? 0;
  }
</script>

<nav>
    <span style="display:none">{steamid}</span>
    <div class="container">
        <a href="/">
            <img class="logo" src="/img/gemcase-logo.svg"  alt="gemcase logo">
        </a>
        <div class="menu">
            <div class="gems">
                <a class="deposit" href="/">
                    <p>DEPOSIT</p>
                </a>
                <div class="balance">
                    <img src="/img/gem.svg" alt="gems icon">
                    <p>{gems === null ? '...' : gems.toFixed(2)}</p>
                </div>
            </div>
            <a class="linkstyle" href="/">
                <img src="/img/inventory.svg" alt="inventory icon">
                <div class="items"></div>
            </a>
            <a class="linkstyle" href="/">
                <img src="/img/user.svg" alt="user icon">
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
    }
</style>
