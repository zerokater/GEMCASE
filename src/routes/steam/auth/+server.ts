import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const params = url.searchParams;
  const openidMode = params.get('openid.mode');
  if (openidMode !== 'id_res') {
    return new Response('Authentication failed', { status: 400 });
  }

  // Build the verification request for Steam OpenID
  const verificationParams = new URLSearchParams();
  for (const [key, value] of params.entries()) {
    verificationParams.set(key, value);
  }
  verificationParams.set('openid.mode', 'check_authentication');

  // Verify with Steam
  const resp = await fetch('https://steamcommunity.com/openid/login', {
    method: 'POST',
    body: verificationParams,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const body = await resp.text();
  if (!body.includes('is_valid:true')) {
    return new Response('Authentication failed', { status: 400 });
  }

  // Extract SteamID from openid.claimed_id
  const claimedId = params.get('openid.claimed_id') || '';
  const match = claimedId.match(/(\d{17})/); // SteamIDs are 17 digits
  const steamid = match ? match[1] : null;
  if (!steamid) {
    return new Response('Could not extract SteamID', { status: 400 });
  }

  // Set the steamid cookie (secure/sameSite for production)
  cookies.set('steamid', steamid, {
    path: '/',
    secure: true,
    sameSite: 'lax'
  });

  // Just redirect to home page (no popup logic)
  return new Response(null, {
    status: 302,
    headers: { Location: '/' }
  });
};
