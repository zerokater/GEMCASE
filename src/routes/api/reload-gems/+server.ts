// src/routes/api/reload-gems/+server.ts
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET({ cookies }) {
  const steamid = cookies.get('steamid');
  if (!steamid) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('gems')
    .eq('steamid', steamid)
    .single();

  if (error || !user) {
    return json({ error: 'User not found' }, { status: 400 });
  }

  return json({ gems: user.gems });
}
