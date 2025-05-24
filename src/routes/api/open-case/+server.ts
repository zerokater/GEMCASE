import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function POST({ request, cookies }) {
  const steamid = cookies.get('steamid');
  if (!steamid) return json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await request.json();

  // 1. Get case
  const { data: kase } = await supabase
    .from('cases')
    .select('id, price')
    .eq('slug', slug)
    .single();

  if (!kase) return json({ error: 'Case not found' }, { status: 400 });

  // 2. Subtract gems
  const { data: ok, error } = await supabase.rpc('subtract_gems', {
    user_steamid: steamid,
    case_id: kase.id
  });
  if (error || !ok) return json({ error: 'Not enough gems' }, { status: 400 });

  // 3. Get skins with chances
  const { data: case_skins } = await supabase
    .from('case_skins')
    .select('chance, skins(*)')
    .eq('case_id', kase.id);

  if (!case_skins || case_skins.length === 0)
    return json({ error: 'No skins found' }, { status: 400 });

  // 4. Roll winner
  const total = case_skins.reduce((sum, s) => sum + s.chance, 0);
  let rand = Math.random() * total;
  let accum = 0;
  let skinWon;
  for (const cs of case_skins) {
    accum += cs.chance;
    if (rand <= accum) {
      skinWon = cs.skins;
      break;
    }
  }
  if (!skinWon) skinWon = case_skins[case_skins.length - 1].skins;

  // 5. Save inventory
  const { data: inv, error: invErr } = await supabase
    .from('inventory')
    .insert([{
      steamid,
      skin_id: skinWon.id,
      case_id: kase.id,
      won_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (invErr) return json({ error: 'Failed to save inventory' }, { status: 500 });

  // 6. Return skin + new gems
  const { data: user } = await supabase
    .from('users')
    .select('gems')
    .eq('steamid', steamid)
    .single();

  return json({
    skin: skinWon,
    gems: user?.gems ?? 0
  });
}
