// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const steamid = cookies.get('steamid') || null;
  return { steamid };
};
