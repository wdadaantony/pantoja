'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function refreshPromotion() {
  const client = await createClient();
  if (!client) throw new Error('No se pudo conectar con Supabase.');
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error('Inicia sesión para publicar la promoción.');
  revalidatePath('/');
}
