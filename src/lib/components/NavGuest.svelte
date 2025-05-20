<script lang="ts">
  function openSteamLoginPopup(event: MouseEvent) {
    event.preventDefault(); // Prevent normal navigation
    const width = 700;
    const height = 650;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    window.open(
      '/steam/login',
      'Steam Login',
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes`
    );
  }
</script>

<nav>
  <div class="container">
    <a href="/">
      <img class="logo" src="/img/gemcase-logo.svg" alt="gemcase logo">
    </a>
    <a class="signin" href="/steam/login" on:click={openSteamLoginPopup}>
      SIGN IN
    </a>
  </div>
</nav>

<style>
  .container{
    border: 1pt solid var(--border);
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
  .signin{
    background-color: var(--accent);
    color: var(--background);
    font-weight: 600;
    display: flex;
    flex-direction: row;
    padding: 6px 32px;
    gap: 28px;
    border-radius: 6px;
    text-decoration: none;
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }
  nav{
    padding: 24px 0px 24px 0px;
    width: 1200px;
    margin: 0 auto;
  }
</style>
