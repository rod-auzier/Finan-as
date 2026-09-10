/**
 * Tela de Despesas (rota `/despesas`, dentro do <Layout>).
 *
 * Responsabilidades:
 *  - listar as despesas do usuário (GET /api/despesas via useRecurso);
 *  - criar despesa (POST /api/despesas) com Descrição, Categoria, Valor e
 *    Vencimento. A Categoria é um <select> limitado a CATEGORIAS_DESPESA;
 *  - excluir despesa (DELETE /api/despesas/:id);
 *  - exibir o total somado das despesas listadas.
 *
 * Não recebe props. Autenticação já garantida pelo <Layout>.
 */
import { useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { useRecurso } from '../hooks/useRecurso.js';
import { brl, dataBR } from '../lib/format.js';
import { CATEGORIAS_DESPESA } from '../lib/constants.js';

const FORM_VAZIO = { descricao: '', categoria: 'Outros', valor: '', vencimento: '' };

export default function Despesas() {
  const { itens: despesas, carregando, erro, recarregar } = useRecurso('/despesas', 'despesas');
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const total = useMemo(
    () => despesas.reduce((soma, d) => soma + Number(d.valor || 0), 0),
    [despesas],
  );

  function setCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function adicionar(e) {
    e.preventDefault();
    setErroForm('');
    setSalvando(true);
    try {
      const payload = {
        descricao: form.descricao,
        categoria: form.categoria,
        valor: Number(form.valor),
      };
      if (form.vencimento) payload.vencimento = form.vencimento; // ISO "aaaa-mm-dd"
      await api.post('/despesas', payload);
      setForm(FORM_VAZIO);
      await recarregar();
    } catch (err) {
      setErroForm(err.response?.data?.message || 'Não foi possível salvar.');
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id) {
    await api.delete(`/despesas/${id}`);
    recarregar();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Despesas</h1>

      {/* Formulário */}
      <form onSubmit={adicionar} className="bg-white rounded-xl shadow p-4 grid gap-3 sm:grid-cols-4">
        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={(e) => setCampo('descricao', e.target.value)}
          className="border rounded-lg px-3 py-2 sm:col-span-2"
          required
        />
        <select
          value={form.categoria}
          onChange={(e) => setCampo('categoria', e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          {CATEGORIAS_DESPESA.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
        <label className="text-sm text-slate-500 sm:col-span-2">
          Vencimento
          <input
            type="date"
            value={form.vencimento}
            onChange={(e) => setCampo('vencimento', e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </label>
        {erroForm && <p className="text-sm text-red-600 sm:col-span-4">{erroForm}</p>}
        <button
          disabled={salvando}
          className="sm:col-span-4 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white rounded-lg py-2"
        >
          {salvando ? 'Salvando…' : 'Adicionar despesa'}
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
                <th className="p-3 font-medium">Descrição</th>
                <th className="p-3 font-medium">Categoria</th>
                <th className="p-3 font-medium">Vencimento</th>
                <th className="p-3 font-medium text-right">Valor</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {despesas.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-slate-500">
                    Nenhuma despesa cadastrada.
                  </td>
                </tr>
              )}
              {despesas.map((d) => (
                <tr key={d._id}>
                  <td className="p-3 font-medium">{d.descricao}</td>
                  <td className="p-3 text-slate-600">{d.categoria}</td>
                  <td className="p-3 text-slate-600">{dataBR(d.vencimento)}</td>
                  <td className="p-3 text-right text-red-600">{brl(d.valor)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => excluir(d._id)}
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
                <td className="p-3 font-medium" colSpan={3}>
                  Total
                </td>
                <td className="p-3 text-right font-semibold text-red-700">{brl(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
