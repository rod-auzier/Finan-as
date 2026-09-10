/**
 * Tela de Login (rota pública `/login`).
 *
 * Responsabilidades:
 *  - renderizar o <AuthForm> no modo "entrar";
 *  - ao autenticar com sucesso, redirecionar para o painel (`/resumo`);
 *  - se o usuário já estiver logado, não mostra a tela (redireciona).
 *
 * O token JWT é salvo no localStorage pelo AuthContext e enviado no
 * header Authorization pelo interceptor de `services/api.js`.
 */
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthForm from '../components/AuthForm.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/resumo" replace />;

  return (
    <AuthForm
      titulo="Entrar"
      textoBotao="Entrar"
      onSubmit={async (credenciais) => {
        await login(credenciais);
        navigate('/resumo');
      }}
      rodape={
        <>
          Não tem conta?{' '}
          <Link to="/registro" className="inline-block py-2 text-accent hover:opacity-80">
            Criar conta
          </Link>
        </>
      }
    />
  );
}
