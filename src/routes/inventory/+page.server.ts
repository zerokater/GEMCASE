import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const steamid = cookies.get('steamid');
  if (!steamid) {
    return { inventory: [] };
  }

  const { data: inventory } = await supabase
    .from('inventory')
    .select('*, skins(*)')
    .eq('steamid', steamid)
    .order('won_at', { ascending: false });

  return { inventory: inventory ?? [] };
};
