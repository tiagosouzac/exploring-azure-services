import axios from "axios";

// Criando a instância do Axios com a configuração base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base da API
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros comuns
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Verifica se o erro é de autenticação (401)
    if (response && response.status === 401) {
      // Token inválido ou expirado, realiza logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redireciona para a página de login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
