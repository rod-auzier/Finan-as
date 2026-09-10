/**
 * SummaryCard — cartão de um valor agregado (tela de Resumo).
 *
 * Props:
 *  - titulo   {string}      Rótulo do cartão (ex.: "Total de Receitas").
 *  - value    {number}      Valor em reais (formatado pelo <Money>).
 *  - tone     {'positive' | 'negative' | 'auto' | 'plain'}  Cor do valor (ver <Money>).
 *  - size     {'hero' | 'default'}  'hero' = número grande, protagonista da tela
 *                                   (Saldo Final); 'default' = card secundário menor.
 *  - children {ReactNode}   Conteúdo auxiliar abaixo do valor (ex.: o selo
 *                           Superávit/Déficit no card hero).
 *
 * Apresentação apenas — superfície `surface`, borda hairline `border`,
 * cantos pouco arredondados, SEM sombra.
 */
import Money from './Money.jsx';

export default function SummaryCard({ titulo, value, tone = 'plain', size = 'default', children }) {
  const hero = size === 'hero';

  return (
    <div className={`rounded border border-border bg-surface ${hero ? 'p-6' : 'p-4'}`}>
      <p className={`uppercase tracking-wide text-muted ${hero ? 'text-xs' : 'text-[11px]'}`}>
        {titulo}
      </p>
      {/* Hero: 32px no mobile → 36px em `sm` → 48px em `md` (não estoura em telas estreitas). */}
      <Money
        value={value}
        tone={tone}
        className={hero ? 'mt-2 block text-[2rem] sm:text-4xl md:text-5xl' : 'mt-1 block text-xl'}
      />
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
