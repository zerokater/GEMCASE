import type { LayoutServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const steamid = cookies.get('steamid') || null;
  let inventoryCount = 0;

  if (steamid) {
    const { count } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true })
      .eq('steamid', steamid);

    inventoryCount = count ?? 0;
  }

  return {
    steamid,
    inventoryCount
  };
};
