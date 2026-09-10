/**
 * Layout — moldura das telas autenticadas.
 *
 * Responsabilidades:
 *  - proteger a área logada: enquanto o AuthContext carrega mostra um
 *    "Carregando…"; sem usuário, redireciona para `/login`;
 *  - renderizar o cabeçalho com o e-mail do usuário e o botão "Sair";
 *  - renderizar a navegação em abas (Receitas / Despesas / Resumo)
 *    usando <NavLink> (a aba ativa ganha destaque);
 *  - renderizar a rota filha atual via <Outlet />.
 *
 * Não recebe props — obtém tudo do AuthContext e do react-router.
 */
import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const abas = [
  { to: '/receitas', label: 'Receitas' },
  { to: '/despesas', label: 'Despesas' },
  { to: '/resumo', label: 'Resumo' },
];

export default function Layout() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div className="p-8 text-slate-500">Carregando…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold text-brand">Painel Financeiro</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-500 hidden sm:inline">{user.email}</span>
            <button onClick={logout} className="text-brand">
              Sair
            </button>
          </div>
        </div>

        <nav className="max-w-4xl mx-auto px-4 flex gap-1">
          {abas.map((aba) => (
            <NavLink
              key={aba.to}
              to={aba.to}
              className={({ isActive }) =>
                `px-4 py-2 text-sm border-b-2 -mb-px ${
                  isActive
                    ? 'border-brand text-brand font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {aba.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
