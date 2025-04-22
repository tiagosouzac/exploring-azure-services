import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

// Props para a rota protegida
interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireAttendant?: boolean;
}

// Componente de rota protegida
export default function ProtectedRoute({
  requireAuth = true,
  requireAttendant = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAttendant, loading } = useAuth();

  // Exibe loader enquanto verifica a autenticação
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-svh">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Verifica se o usuário está autenticado quando necessário
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verifica se é um atendente quando essa permissão é necessária
  if (requireAttendant && !isAttendant) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Se tudo estiver ok, renderiza as rotas filhas
  return <Outlet />;
}
