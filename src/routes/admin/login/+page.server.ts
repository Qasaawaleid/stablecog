import { error, type ServerLoad } from '@sveltejs/kit';
import { supabaseClient } from '$ts/constants/supabaseClient';

export const load: ServerLoad = async (event) => {
	if (!supabaseClient) throw error(500, 'Supabase not configured');
};