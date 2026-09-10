/**
 * Tela de Resumo (rota `/resumo`, dentro do <Layout>).
 *
 * Responsabilidades:
 *  - buscar os totais do backend (GET /api/resumo);
 *  - buscar a lista de despesas (GET /api/despesas) para o gráfico;
 *  - destacar o **Saldo Final** como elemento visual principal (número grande,
 *    card `size="hero"`), com Total de Receitas e Total de Despesas como
 *    cards secundários menores ao lado;
 *  - indicador Superávit (verde, `saldo >= 0`) / Déficit (vermelho, `< 0`),
 *    exibido dentro do card do Saldo Final;
 *  - renderizar <DespesasPorCategoriaChart>.
 *
 * Não recebe props. Autenticação já garantida pelo <Layout>.
 * Cores/tipografia: tokens do tema (ver `src/index.css`).
 */
import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
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

  if (carregando) return <p className="text-muted">Carregando…</p>;
  if (erro) return <p className="text-negative">{erro}</p>;

  const superavit = resumo.saldo >= 0;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Resumo</h1>

      {/* Saldo Final em destaque (2/3) + cards secundários (1/3) */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <SummaryCard titulo="Saldo Final" value={resumo.saldo} tone="auto" size="hero">
            {/* Indicador Superávit / Déficit */}
            <span
              className={`text-sm font-medium ${superavit ? 'text-positive' : 'text-negative'}`}
            >
              {superavit ? '▲ Superávit' : '▼ Déficit'}
            </span>
          </SummaryCard>
        </div>

        <div className="grid gap-4">
          <SummaryCard titulo="Total de Receitas" value={resumo.totalReceitas} tone="positive" />
          <SummaryCard titulo="Total de Despesas" value={resumo.totalDespesas} tone="negative" />
        </div>
      </div>

      {/* Gráfico */}
      <div className="rounded border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-medium text-muted">Despesas por categoria</h2>
        <DespesasPorCategoriaChart despesas={despesas} />
      </div>
    </div>
  );
}
