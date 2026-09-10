/**
 * ListaLancamentos — coleção de lançamentos (receitas ou despesas), RESPONSIVA.
 *
 * Breakpoint de virada: `md` (768px, padrão do Tailwind).
 *  - <  md (mobile) : cada lançamento vira um CARD empilhado, com os campos
 *                     em coluna (label em cima, valor embaixo). Um card final
 *                     mostra o Total.
 *  - >= md (desktop): TABELA tradicional — cabeçalho, linhas com divisórias
 *                     hairline e rodapé com o Total.
 * As duas versões saem do MESMO array `itens` / `colunas`; alterna-se só a
 * apresentação (`md:hidden` no bloco mobile, `hidden md:block` no desktop).
 *
 * Props:
 *  - colunas   {Array<{ chave, label, alinhar?: 'right', render?: (item)=>node, classe?: string }>}
 *      Colunas/campos. `render(item)` customiza a célula (ex.: <Money>);
 *      sem ele, mostra `item[chave]` (ou "—" se vazio).
 *      A ÚLTIMA coluna é tratada como a coluna de valor no rodapé de total.
 *  - itens     {Array<object>}      dados já carregados.
 *  - getId     {(item) => string}   key/id de cada item.
 *  - onExcluir {(id) => void}       ação do botão ✕.
 *  - total     {ReactNode}          total já formatado (ex.: <Money>).
 *  - vazio     {string}             texto quando não há itens.
 *  - carregando{boolean} / erro {string}
 */
function valorCelula(item, col) {
  if (col.render) return col.render(item);
  const v = item[col.chave];
  return v === '' || v == null ? '—' : v;
}

export default function ListaLancamentos({
  colunas,
  itens,
  getId,
  onExcluir,
  total,
  vazio,
  carregando,
  erro,
}) {
  if (carregando) return <p className="text-muted">Carregando…</p>;
  if (erro) return <p className="text-negative">{erro}</p>;

  return (
    <>
      {/* ---------------- MOBILE (< md): cards empilhados ---------------- */}
      <ul className="space-y-3 md:hidden">
        {itens.length === 0 && (
          <li className="rounded border border-border bg-surface p-4 text-muted">{vazio}</li>
        )}

        {itens.map((item) => (
          <li key={getId(item)} className="rounded border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <dl className="min-w-0 flex-1 space-y-2">
                {colunas.map((col) => (
                  <div key={col.chave}>
                    <dt className="text-xs uppercase tracking-wide text-muted">{col.label}</dt>
                    <dd className="mt-0.5 break-words text-base">{valorCelula(item, col)}</dd>
                  </div>
                ))}
              </dl>

              {/* Botão de excluir: 44x44 (área de toque mínima). */}
              <button
                onClick={() => onExcluir(getId(item))}
                aria-label="Excluir"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted hover:text-negative"
              >
                ✕
              </button>
            </div>
          </li>
        ))}

        {/* Total (card) */}
        <li className="flex items-center justify-between rounded border border-border bg-surface px-4 py-3">
          <span className="text-xs uppercase tracking-wide text-muted">Total</span>
          {total}
        </li>
      </ul>

      {/* ---------------- DESKTOP (>= md): tabela ---------------- */}
      <div className="hidden overflow-x-auto rounded border border-border md:block">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              {colunas.map((col) => (
                <th
                  key={col.chave}
                  className={`p-3 font-medium ${col.alinhar === 'right' ? 'text-right' : ''}`}
                >
                  {col.label}
                </th>
              ))}
              <th className="p-3" />
            </tr>
          </thead>

          {/* Divisórias finas (hairline) entre linhas: divide-border. */}
          <tbody className="divide-y divide-border">
            {itens.length === 0 && (
              <tr>
                <td colSpan={colunas.length + 1} className="p-4 text-muted">
                  {vazio}
                </td>
              </tr>
            )}
            {itens.map((item) => (
              <tr key={getId(item)}>
                {colunas.map((col) => (
                  <td
                    key={col.chave}
                    className={`p-3 ${col.alinhar === 'right' ? 'text-right' : ''} ${col.classe ?? ''}`}
                  >
                    {valorCelula(item, col)}
                  </td>
                ))}
                <td className="p-3 text-right">
                  <button
                    onClick={() => onExcluir(getId(item))}
                    aria-label="Excluir"
                    className="inline-flex h-9 w-9 items-center justify-center rounded text-muted hover:text-negative"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t border-border bg-surface">
              <td className="p-3 font-medium" colSpan={Math.max(1, colunas.length - 1)}>
                Total
              </td>
              <td className="p-3 text-right">{total}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
