
import { createClient } from '@supabase/supabase-js';

// Correção: Em um projeto com build (Vite), as variáveis expostas ao cliente usam import.meta.env e o prefixo VITE_.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseKey) {
  // A mensagem de erro agora reflete os nomes corretos das variáveis.
  throw new Error('As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas. Verifique a configuração na Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);