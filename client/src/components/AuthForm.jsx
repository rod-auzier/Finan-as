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
 *
 * Cores: tudo via tokens (`surface`, `border`, `fg`, `muted`, `accent`,
 * `negative`) — ver `src/index.css`.
 */
import { useState } from 'react';

// `text-base` (16px) evita o zoom automático do iOS ao focar o campo;
// `min-h-[44px]` garante área de toque confortável.
const INPUT =
  'mt-1 w-full min-h-[44px] rounded border border-border bg-bg px-3 py-2 text-base text-fg ' +
  'placeholder:text-muted focus:border-accent focus:outline-none';

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
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-surface p-6"
      >
        <h1 className="text-center text-xl font-semibold">{titulo}</h1>

        <label className="block text-sm text-muted">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
            required
          />
        </label>

        <label className="block text-sm text-muted">
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={INPUT}
            minLength={6}
            required
          />
        </label>

        {erro && <p className="text-sm text-negative">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="min-h-[44px] w-full rounded bg-accent py-2 font-medium text-bg hover:opacity-90 disabled:opacity-60"
        >
          {enviando ? 'Aguarde…' : textoBotao}
        </button>

        {rodape && <div className="text-center text-sm text-muted">{rodape}</div>}
      </form>
    </div>
  );
}
