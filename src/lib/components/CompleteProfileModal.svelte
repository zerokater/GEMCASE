<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  export let steamid: string;
  export let onComplete: () => void;

  let username = '';
  let tradeUrl = '';
  let is18 = false;
  let acceptTermsPrivacy = false;
  let loading = false;
  let error = '';

  async function saveProfile() {
    error = '';
    if (!username || !tradeUrl || !is18 || !acceptTermsPrivacy) {
      error = 'All fields must be filled and agreements accepted.';
      return;
    }
    loading = true;
    const { error: supaError } = await supabase.from('users').insert({
      steamid,
      username,
      trade_url: tradeUrl,
      is_18: is18,
      accepted_terms_privacy: acceptTermsPrivacy,
      gems: 0
    });
    loading = false;
    if (supaError) {
      error = supaError.message;
    } else {
      onComplete();
    }
  }
</script>

{#if error}
  <div class="error">{error}</div>
{/if}

<div class="modal-bg">
  <div class="modal-content">
    <h2>Complete your profile</h2>
    <input class="modal-input" type="text" bind:value={username} placeholder="Username" />

    <label class="helper-label">
      Steam Trade URL <br>
      <span class="helper-text">
        You can get your Steam Trade URL here:<br>
        <a href="http://steamcommunity.com/my/tradeoffers/privacy" target="_blank" rel="noopener">http://steamcommunity.com/my/tradeoffers/privacy</a>
      </span>
    </label>
    <input class="modal-input" type="text" bind:value={tradeUrl} placeholder="Steam Trade URL" />

    <label class="modal-checkbox">
      <input type="checkbox" bind:checked={is18} />
      I am at least 18 years old
    </label>
    <label class="modal-checkbox">
      <input type="checkbox" bind:checked={acceptTermsPrivacy} />
      I accept the <a href="/terms" target="_blank">Terms and Privacy Policy</a>
    </label>
    <button class="modal-btn" on:click={saveProfile} disabled={loading}>
      {loading ? 'Saving...' : 'Save'}
    </button>
  </div>
</div>

<style>
  .modal-bg {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(28, 28, 32, 0.96); /* match your site dark */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    background: #22232b;
    color: #fff;
    border-radius: 18px;
    padding: 40px 32px 32px 32px;
    min-width: 350px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 95vw;
  }
  .modal-content h2 {
    margin-bottom: 12px;
    font-size: 1.6rem;
    letter-spacing: 0.5px;
    font-weight: 700;
    color: #fff;
    text-align: center;
  }
  .modal-input {
    background: #181920;
    color: #fff;
    border: 1px solid #31313f;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 1rem;
    margin-bottom: 6px;
    outline: none;
    transition: border 0.15s;
  }
  .modal-input:focus {
    border-color: var(--accent, #00dfa2);
  }
  .modal-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1rem;
    margin-bottom: 0;
    color: #d3d3df;
  }
  .modal-checkbox a {
    color: var(--accent, #00dfa2);
    text-decoration: underline;
    font-weight: 500;
  }
  .modal-btn {
    background: var(--accent, #00dfa2);
    color: #181920;
    font-weight: 700;
    border: none;
    border-radius: 8px;
    padding: 12px 0;
    font-size: 1rem;
    margin-top: 14px;
    cursor: pointer;
    transition: background 0.18s;
  }
  .modal-btn:disabled {
    background: #333b45;
    color: #bbb;
    cursor: not-allowed;
  }
  .error {
    color: #ef233c;
    background: rgba(40,0,0,0.12);
    border-radius: 8px;
    padding: 8px 12px;
    margin: 12px 0 0 0;
    text-align: center;
  }
  .helper-label {
    font-size: 1rem;
    color: #fff;
    margin-bottom: 3px;
    font-weight: 500;
  }
  .helper-text {
    display: block;
    color: #b3b4c1;
    font-size: 0.96rem;
    margin-bottom: 5px;
    margin-top: 2px;
    line-height: 1.3;
    font-weight: 400;
  }
  .helper-text a {
    color: var(--accent, #00dfa2);
    text-decoration: underline;
    font-size: 0.97em;
    word-break: break-all;
  }
</style>
