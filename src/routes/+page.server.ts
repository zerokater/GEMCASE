import { supabase } from '$lib/supabaseClient';

export const load = async () => {
  // 1. Fetch all cases (with image)
  const { data: cases } = await supabase
    .from('cases')
    .select('id, name, price, category, slug, image_url')
    .order('name', { ascending: true });

  // 2. For each case, get the rarest (lowest %) skin
  const rarestSkinByCase: Record<string, any[]> = {};
  for (const kase of cases ?? []) {
    const { data: case_skins } = await supabase
      .from('case_skins')
      .select('*, skins(*)')
      .eq('case_id', kase.id)
      .order('chance', { ascending: true }) // rarest first
      .limit(1);

    rarestSkinByCase[kase.id] = case_skins || [];
  }

  return {
    cases: cases ?? [],
    rarestSkinByCase
  };
};
