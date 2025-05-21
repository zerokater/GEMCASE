// +page.server.ts
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { slug } = event.params;

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

  return {
    kase,
    case_skins: case_skins ?? []
  };
};
