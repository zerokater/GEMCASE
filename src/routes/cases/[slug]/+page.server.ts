// +page.server.ts
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { slug } = event.params;

  // Get the steamid from parent load (if you have it in parent)
  const parent = await event.parent();
  const steamid = parent?.steamid ?? null;

  // 1. Get the case info
  const { data: kase } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .single();

  // 2. Get all skins in this case (with drop chances)
  const { data: case_skins } = await supabase
    .from('case_skins')
    .select('*, skins(*)')
    .eq('case_id', kase.id);

  // 3. Get gems if logged in
  let gems = 0;
  if (steamid) {
    const { data: user } = await supabase
      .from('users')
      .select('gems')
      .eq('steamid', steamid)
      .single();
    gems = user?.gems ?? 0;
  }

  return {
    kase,
    case_skins: case_skins ?? [],
    gems,
    steamid
  };
};
