/**
 * AuthForm — formulário reutilizável de e-mail + senha.
 * Usado tanto na tela de Login quanto na de Registro (a única diferença
 * entre elas são os textos e o callback de submit).
 *
 * Props:
 *  - titulo      {string}                     Título exibido no topo do card.
 *  - textoBotao  {string}                     Rótulo do botão de submit.
 *  - onSubmit    {({email, senha}) => Promise} Chamado ao enviar; deve lançar
 *                                              em caso de erro (a mensagem é exibida).
 *  - rodape      {ReactNode}                   Área abaixo do botão (link para a
 *                                              outra tela).
 *
 * Responsabilidades:
 *  - controlar os inputs (estado local `email`/`senha`);
 *  - impedir submit duplo enquanto a requisição roda (`enviando`);
 *  - capturar erros do `onSubmit` e mostrar a mensagem da API.
 */
import { useState } from 'react';

export default function AuthForm({ titulo, textoBotao, onSubmit, rodape }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await onSubmit({ email, senha });
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível concluir. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">{titulo}</h1>

        <label className="block text-sm">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            required
          />
        </label>

        <label className="block text-sm">
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            minLength={6}
            required
          />
        </label>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-brand hover:bg-brand-dark disabled:opacity-60 text-white rounded-lg py-2"
        >
          {enviando ? 'Aguarde…' : textoBotao}
        </button>

        {rodape && <div className="text-center text-sm text-slate-600">{rodape}</div>}
      </form>
    </div>
  );
}
