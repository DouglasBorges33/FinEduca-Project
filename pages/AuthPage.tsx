import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Spinner from '../components/Spinner';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // O onAuthStateChange em App.tsx cuidará do redirecionamento
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            user_metadata: { 
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        if (data.user && data.user.identities && data.user.identities.length === 0) {
           setMessage("Usuário já existe. Tente fazer login.");
        } else {
           setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
        }
      }
    } catch (err: any) {
        console.error("Auth error:", err);
        let displayError = "Ocorreu um erro. Tente novamente.";
        if (err.message.includes("Invalid login credentials")) {
            displayError = "E-mail ou senha inválidos.";
        } else if (err.message.includes("already registered")) {
            displayError = "Este e-mail já está cadastrado. Tente fazer login.";
        } else if (err.message.includes("Password should be at least 6 characters")) {
            displayError = "A senha deve ter pelo menos 6 caracteres.";
        }
        setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center space-x-2 mb-8">
           <div className="w-10 h-10 bg-gradient-to-tr from-[rgb(var(--color-primary-light))] to-[rgb(var(--color-accent-light))] rounded-lg flex items-center justify-center">
                <span className="text-slate-900 font-bold text-2xl">F</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-100">
              FinEduca
            </h1>
        </div>
      
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>

          {error && <p className="bg-red-500/20 text-red-300 text-center p-3 rounded-md mb-4">{error}</p>}
          {message && <p className="bg-green-500/20 text-green-300 text-center p-3 rounded-md mb-4">{message}</p>}

          <form onSubmit={handleAuth}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="fullName">
                    Nome Completo
                  </label>
                  <input
                    id="fullName"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="password">
                  Senha
                </label>
                <input
                  id="password"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-dark))] text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-slate-600 flex items-center justify-center"
            >
              {loading && <Spinner />}
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setMessage(null);
              }}
              className="font-semibold text-[rgb(var(--color-primary-light))] hover:underline ml-1"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;