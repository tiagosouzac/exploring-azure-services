import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/services/api";
import { User } from "@/utils/types";

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAttendant: boolean;
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para o provedor de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

// Provedor de contexto de autenticação
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário já está autenticado ao iniciar a aplicação
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Função para realizar login
  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      const { token: newToken, user: userData } = response.data.data;

      // Armazena os dados no estado e no localStorage
      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Função para realizar logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Valores a serem disponibilizados pelo contexto
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isAttendant: user?.role === "ATENDENTE",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
