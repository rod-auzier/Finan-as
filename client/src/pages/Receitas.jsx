/**
 * Tela de Receitas (rota `/receitas`, dentro do <Layout>).
 *
 * Responsabilidades:
 *  - listar as receitas do usuário (GET /api/receitas via useRecurso);
 *  - criar receita (POST /api/receitas) com Fonte, Descrição e Valor;
 *  - editar receita inline na tabela/card (PUT /api/receitas/:id) — a
 *    validação em `salvarEdicao` repete a do formulário de criação;
 *  - excluir receita (DELETE /api/receitas/:id);
 *  - exibir o total somado.
 *
 * Responsivo (breakpoint `sm` / `md`, padrões do Tailwind):
 *  - formulário: 1 coluna no mobile, 2 colunas a partir de `sm` (640px);
 *  - lista: cards empilhados no mobile, tabela a partir de `md` — feito
 *    pelo <ListaLancamentos>.
 * Inputs em `text-base` (16px) para não disparar zoom automático no iOS;
 * botão com altura mínima de 44px.
 */
import { useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { useRecurso } from '../hooks/useRecurso.js';
import Money from '../components/Money.jsx';
import ListaLancamentos from '../components/ListaLancamentos.jsx';

const FORM_VAZIO = { fonte: '', descricao: '', valor: '' };
const INPUT =
  'min-h-[44px] rounded border border-border bg-surface px-3 py-2 text-base text-fg ' +
  'placeholder:text-muted focus:border-accent focus:outline-none';

export default function Receitas() {
  const { itens: receitas, carregando, erro, recarregar } = useRecurso('/receitas', 'receitas');
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const total = useMemo(
    () => receitas.reduce((soma, r) => soma + Number(r.valor || 0), 0),
    [receitas],
  );

  function setCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function adicionar(e) {
    e.preventDefault();
    setErroForm('');
    setSalvando(true);
    try {
      await api.post('/receitas', {
        fonte: form.fonte,
        descricao: form.descricao,
        valor: Number(form.valor),
      });
      setForm(FORM_VAZIO);
      await recarregar();
    } catch (err) {
      setErroForm(err.response?.data?.message || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    await api.delete(`/receitas/${id}`);
    recarregar();
  }

  /**
   * Salva a edição inline de uma receita.
   * Mesma validação do formulário de criação (fonte obrigatória, valor
   * numérico ≥ 0). Lança Error com mensagem em caso de problema — o
   * <ListaLancamentos> exibe a mensagem na própria linha.
   */
  async function salvarEdicao(id, rascunho) {
    const fonte = (rascunho.fonte ?? '').trim();
    const valorNum = Number(rascunho.valor);
    if (!fonte) throw new Error('Fonte é obrigatória.');
    if (rascunho.valor === '' || Number.isNaN(valorNum) || valorNum < 0) {
      throw new Error('Valor deve ser um número maior ou igual a zero.');
    }
    await api.put(`/receitas/${id}`, {
      fonte,
      descricao: (rascunho.descricao ?? '').trim(),
      valor: valorNum,
    });
    await recarregar();
  }

  const colunas = [
    { chave: 'fonte', label: 'Fonte', editor: 'text' },
    { chave: 'descricao', label: 'Descrição', classe: 'text-muted', editor: 'text' },
    {
      chave: 'valor',
      label: 'Valor',
      alinhar: 'right',
      editor: 'number',
      render: (r) => <Money value={r.valor} tone="positive" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Receitas</h1>

      {/* Formulário — 1 coluna no mobile, 2 colunas a partir de `sm`. */}
      <form
        onSubmit={adicionar}
        className="grid gap-3 rounded border border-border bg-surface p-4 sm:grid-cols-2"
      >
        <input
          placeholder="Fonte"
          value={form.fonte}
          onChange={(e) => setCampo('fonte', e.target.value)}
          className={INPUT}
          required
        />
        <input
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => setCampo('valor', e.target.value)}
          className={`${INPUT} num`}
          required
        />
        {/* Descrição ocupa a linha inteira no layout de 2 colunas. */}
        <input
          placeholder="Descrição (opcional)"
          value={form.descricao}
          onChange={(e) => setCampo('descricao', e.target.value)}
          className={`${INPUT} sm:col-span-2`}
        />
        {erroForm && <p className="text-sm text-negative sm:col-span-2">{erroForm}</p>}
        <button
          disabled={salvando}
          className="min-h-[44px] rounded bg-accent px-4 font-medium text-bg hover:opacity-90 disabled:opacity-60 sm:col-span-2"
        >
          {salvando ? 'Salvando…' : 'Adicionar receita'}
        </button>
      </form>

      <ListaLancamentos
        colunas={colunas}
        itens={receitas}
        getId={(r) => r._id}
        onExcluir={excluir}
        aoSalvarEdicao={salvarEdicao}
        total={<Money value={total} tone="positive" className="font-medium" />}
        vazio="Nenhuma receita cadastrada."
        carregando={carregando}
        erro={erro}
      />
    </div>
  );
}
