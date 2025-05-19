// src/routes/steam/login/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const params = new URLSearchParams({
    'openid.ns': 'http://specs.openid.net/auth/2.0',
    'openid.mode': 'checkid_setup',
    'openid.return_to': 'http://localhost:5173/steam/auth',
    'openid.realm': 'http://localhost:5173/',
    'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
    'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://steamcommunity.com/openid/login?${params.toString()}`
    }
  });
};
