/**
 * Tela de Resumo (rota `/resumo`, dentro do <Layout>).
 *
 * Responsabilidades:
 *  - buscar os totais do backend (GET /api/resumo);
 *  - buscar a lista de despesas (GET /api/despesas) para alimentar o
 *    gráfico de despesas por categoria;
 *  - exibir 3 cartões: Total de Receitas, Total de Despesas e Saldo Final;
 *  - exibir um indicador visual: "Superávit" (verde) quando saldo ≥ 0,
 *    "Déficit" (vermelho) quando saldo < 0;
 *  - renderizar <DespesasPorCategoriaChart>.
 *
 * Não recebe props. Autenticação já garantida pelo <Layout>.
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { brl } from '../lib/format.js';
import SummaryCard from '../components/SummaryCard.jsx';
import DespesasPorCategoriaChart from '../components/DespesasPorCategoriaChart.jsx';

export default function Resumo() {
  const [resumo, setResumo] = useState(null); // { totalReceitas, totalDespesas, saldo }
  const [despesas, setDespesas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const [r1, r2] = await Promise.all([api.get('/resumo'), api.get('/despesas')]);
        if (!ativo) return;
        setResumo(r1.data);
        setDespesas(r2.data.despesas ?? []);
      } catch (err) {
        if (ativo) setErro(err.response?.data?.message || 'Falha ao carregar o resumo.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) return <p className="text-slate-500">Carregando…</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  const superavit = resumo.saldo >= 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Resumo</h1>

        {/* Indicador visual Superávit / Déficit */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            superavit ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {superavit ? '▲ Superávit' : '▼ Déficit'}
        </span>
      </div>

      {/* Cartões */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard titulo="Total de Receitas" valor={brl(resumo.totalReceitas)} cor="verde" />
        <SummaryCard titulo="Total de Despesas" valor={brl(resumo.totalDespesas)} cor="vermelho" />
        <SummaryCard
          titulo="Saldo Final"
          valor={brl(resumo.saldo)}
          cor={superavit ? 'verde' : 'vermelho'}
          destaque
        />
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold mb-3">Despesas por categoria</h2>
        <DespesasPorCategoriaChart despesas={despesas} />
      </div>
    </div>
  );
}
