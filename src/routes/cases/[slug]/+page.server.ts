// /src/routes/cases/[slug]/+page.server.ts
import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const parent = await event.parent();
  const { slug } = event.params;
  const steamid = parent.steamid;

  // Get the case info
  const { data: kase, error: caseError } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .single();

  if (caseError || !kase) throw new Error('Case not found');

  // Get all skins in this case
  const { data: case_skins } = await supabase
    .from('case_skins')
    .select('*, skins(*)')
    .eq('case_id', kase.id);

  // Sort by value descending (most valuable first)
  const sorted_case_skins = (case_skins ?? []).sort((a, b) => {
    if (!a.skins || !b.skins) return 0;
    return (b.skins.price ?? 0) - (a.skins.price ?? 0);
  });

  return {
    kase,
    case_skins: sorted_case_skins,
    steamid
  };
};
