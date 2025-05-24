import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function POST({ cookies, request }) {
  const steamid = cookies.get('steamid');
  if (!steamid) return json({ error: 'Unauthorized' }, { status: 401 });

  const { skin_id } = await request.json();

  // 1. Find latest inventory row for this user and skin
  const { data: item } = await supabase
    .from('inventory')
    .select('*')
    .eq('steamid', steamid)
    .eq('skin_id', skin_id)
    .order('won_at', { ascending: false })
    .limit(1)
    .single();
  if (!item) return json({ error: 'Skin not found' }, { status: 404 });

  // 2. Get skin price
  const { data: skin } = await supabase
    .from('skins')
    .select('price')
    .eq('id', skin_id)
    .single();
  if (!skin) return json({ error: 'Skin price missing' }, { status: 500 });

  // 3. Delete skin from inventory
  await supabase.from('inventory').delete().eq('id', item.id);

  // 4. Add gems
  const { data: user } = await supabase
    .from('users')
    .select('gems')
    .eq('steamid', steamid)
    .single();
  const newGems = (user?.gems ?? 0) + skin.price;

  await supabase.from('users').update({ gems: newGems }).eq('steamid', steamid);

  return json({ gems: newGems });
}
