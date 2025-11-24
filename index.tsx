import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Caso de falha improvável, mas é bom ter uma segurança.
  document.body.innerHTML = '<div style="color: red; font-family: sans-serif; padding: 20px;">Erro Crítico: O elemento "root" para iniciar a aplicação não foi encontrado no HTML.</div>';
} else {
    // Se tudo estiver OK, renderiza o App React normalmente.
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}
