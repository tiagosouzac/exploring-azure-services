import { Route, Routes, Navigate } from "react-router";
import Login from "@/pages/login";
import Register from "@/pages/register";
import AppLayout from "@/layouts/app";
import Ticket from "@/pages/ticket";
import NewTicket from "@/pages/new-ticket";
import Dashboard from "@/pages/dashboard";
import ProtectedRoute from "@/components/protected-route";
import { AuthProvider } from "@/context/AuthContext";

// Página de acesso não autorizado
const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold mb-4">Acesso não autorizado</h1>
      <p className="text-muted-foreground mb-4">
        Você não tem permissão para acessar esta página.
      </p>
      <a href="/dashboard" className="text-primary hover:underline">
        Voltar para o Dashboard
      </a>
    </div>
  );
};

// Página não encontrada
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="text-muted-foreground mb-4">
        A página que você está procurando não existe.
      </p>
      <a href="/dashboard" className="text-primary hover:underline">
        Voltar para o Dashboard
      </a>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<ProtectedRoute requireAuth={false} />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Rotas protegidas (requer autenticação) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="tickets">
              <Route path=":id" element={<Ticket />} />
              <Route path="new" element={<NewTicket />} />
            </Route>
          </Route>
        </Route>

        {/* Páginas de erro */}
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="404" element={<NotFound />} />

        {/* Redirecionamentos */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
