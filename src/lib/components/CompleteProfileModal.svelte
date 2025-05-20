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
      gems: 100
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
  <div style="color: red; margin-bottom: 10px;">{error}</div>
{/if}

<div class="modal">
  <h2>Complete your profile</h2>
  <input type="text" bind:value={username} placeholder="Username" />
  <input type="text" bind:value={tradeUrl} placeholder="Steam Trade URL" />
  <label>
    <input type="checkbox" bind:checked={is18} />
    I am at least 18 years old
  </label>
  <label>
    <input type="checkbox" bind:checked={acceptTermsPrivacy} />
    I accept the <a href="/terms" target="_blank">Terms and Privacy Policy</a>
  </label>
  <button on:click={saveProfile} disabled={loading}>
    {loading ? 'Saving...' : 'Save'}
  </button>
</div>

<style>
  .modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    padding: 40px;
    gap: 12px;
    color: #fff;
  }
  .modal input[type="text"], .modal input:not([type]) {
    padding: 8px;
    border-radius: 6px;
    margin-bottom: 8px;
    width: 250px;
  }
  .modal button {
    padding: 8px 32px;
    border-radius: 6px;
    margin-top: 14px;
    font-size: 16px;
  }
  .modal label {
    margin-bottom: 6px;
  }
</style>
