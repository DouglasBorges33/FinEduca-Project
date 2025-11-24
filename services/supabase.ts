
import { createClient } from '@supabase/supabase-js';

// Correção: Variáveis de ambiente em ambientes sem build não usam o prefixo VITE_.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseKey) {
  // A mensagem de erro agora reflete os nomes corretos das variáveis.
  throw new Error('As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY não foram encontradas. Verifique a configuração na Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);