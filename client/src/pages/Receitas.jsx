/**
 * Tela de Receitas (rota `/receitas`, dentro do <Layout>).
 *
 * Responsabilidades:
 *  - listar as receitas do usuário (GET /api/receitas via useRecurso);
 *  - criar receita (POST /api/receitas) com os campos Fonte, Descrição e Valor;
 *  - excluir receita (DELETE /api/receitas/:id);
 *  - exibir o total somado das receitas listadas.
 *
 * Não recebe props. Autenticação já garantida pelo <Layout>.
 */
import { useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { useRecurso } from '../hooks/useRecurso.js';
import { brl } from '../lib/format.js';

const FORM_VAZIO = { fonte: '', descricao: '', valor: '' };

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

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Receitas</h1>

      {/* Formulário */}
      <form onSubmit={adicionar} className="bg-white rounded-xl shadow p-4 grid gap-3 sm:grid-cols-4">
        <input
          placeholder="Fonte"
          value={form.fonte}
          onChange={(e) => setCampo('fonte', e.target.value)}
          className="border rounded-lg px-3 py-2 sm:col-span-1"
          required
        />
        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setCampo('descricao', e.target.value)}
          className="border rounded-lg px-3 py-2 sm:col-span-2"
        />
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => setCampo('valor', e.target.value)}
          className="border rounded-lg px-3 py-2"
          required
        />
        {erroForm && <p className="text-sm text-red-600 sm:col-span-4">{erroForm}</p>}
        <button
          disabled={salvando}
          className="sm:col-span-4 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white rounded-lg py-2"
        >
          {salvando ? 'Salvando…' : 'Adicionar receita'}
        </button>
      </form>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {carregando ? (
          <p className="p-4 text-slate-500">Carregando…</p>
        ) : erro ? (
          <p className="p-4 text-red-600">{erro}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="p-3 font-medium">Fonte</th>
                <th className="p-3 font-medium">Descrição</th>
                <th className="p-3 font-medium text-right">Valor</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {receitas.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-slate-500">
                    Nenhuma receita cadastrada.
                  </td>
                </tr>
              )}
              {receitas.map((r) => (
                <tr key={r._id}>
                  <td className="p-3 font-medium">{r.fonte}</td>
                  <td className="p-3 text-slate-600">{r.descricao || '—'}</td>
                  <td className="p-3 text-right text-green-600">{brl(r.valor)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => excluir(r._id)}
                      className="text-slate-400 hover:text-red-600"
                      aria-label="Excluir"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-slate-50">
                <td className="p-3 font-medium" colSpan={2}>
                  Total
                </td>
                <td className="p-3 text-right font-semibold text-green-700">{brl(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
