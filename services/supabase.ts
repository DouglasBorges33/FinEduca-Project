
import { createClient } from '@supabase/supabase-js';

// As variáveis agora são lidas com o prefixo VITE_, que a Vercel exige para expô-las.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseKey) {
  // A mensagem de erro agora reflete os nomes corretos das variáveis.
  throw new Error('As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas. Verifique a configuração na Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);