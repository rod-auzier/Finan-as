/**
 * DespesasPorCategoriaChart — gráfico de barras (Recharts) com o total
 * gasto em cada categoria de despesa.
 *
 * Props:
 *  - despesas {Array<{ categoria: string, valor: number }>}
 *      Lista crua de despesas do usuário. O componente faz a agregação
 *      (soma por categoria) internamente.
 *
 * Responsabilidades:
 *  - somar os valores por categoria, respeitando a ordem de CATEGORIAS_DESPESA;
 *  - omitir categorias sem gasto;
 *  - exibir um estado vazio quando não há despesas;
 *  - colorir cada barra com a cor fixa da categoria (COR_CATEGORIA).
 */
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CATEGORIAS_DESPESA, COR_CATEGORIA } from '../lib/constants.js';
import { brl } from '../lib/format.js';

export default function DespesasPorCategoriaChart({ despesas }) {
  // Agrega: { categoria -> soma }. Categoria fora da lista cai em "Outros".
  const somaPorCategoria = despesas.reduce((acc, d) => {
    const cat = CATEGORIAS_DESPESA.includes(d.categoria) ? d.categoria : 'Outros';
    acc[cat] = (acc[cat] || 0) + Number(d.valor || 0);
    return acc;
  }, {});

  const dados = CATEGORIAS_DESPESA
    .map((categoria) => ({ categoria, total: somaPorCategoria[categoria] || 0 }))
    .filter((item) => item.total > 0);

  if (dados.length === 0) {
    return <p className="text-slate-500 text-sm">Sem despesas para exibir no gráfico.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={dados} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v) => brl(v)} width={90} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => brl(v)} />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {dados.map((item) => (
            <Cell key={item.categoria} fill={COR_CATEGORIA[item.categoria]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
