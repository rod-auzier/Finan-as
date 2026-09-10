/**
 * SummaryCard — cartão de um valor agregado (usado na tela de Resumo).
 *
 * Props:
 *  - titulo   {string}   Rótulo do cartão (ex.: "Total de Receitas").
 *  - valor    {string}   Valor já formatado (ex.: "R$ 1.234,56").
 *  - cor      {'verde'|'vermelho'|'neutro'}  Cor do valor. Default 'neutro'.
 *  - destaque {boolean}   Se true, aplica borda colorida (usado no Saldo Final).
 *
 * Componente puramente de apresentação — não busca dados.
 */
const CORES = {
  verde: 'text-green-600',
  vermelho: 'text-red-600',
  neutro: 'text-slate-900',
};

const BORDAS = {
  verde: 'border-green-500',
  vermelho: 'border-red-500',
  neutro: 'border-slate-200',
};

export default function SummaryCard({ titulo, valor, cor = 'neutro', destaque = false }) {
  return (
    <div className={`bg-white rounded-xl shadow p-4 border ${destaque ? BORDAS[cor] : 'border-transparent'}`}>
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className={`text-2xl font-semibold ${CORES[cor]}`}>{valor}</p>
    </div>
  );
}
