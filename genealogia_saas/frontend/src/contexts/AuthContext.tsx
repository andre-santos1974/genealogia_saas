import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Definição dos tipos
type User = {
  id: string;
  email: string;
  name: string;
  role: 'organization' | 'admin';
  organizationId?: string; // Apenas para usuários do tipo organização
  planId?: string; // ID do plano atual
  isTrialActive?: boolean; // Indica se o período de teste está ativo
  trialExpirationDate?: string; // Data de expiração do período de teste
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  checkTrialStatus: () => boolean;
};

// Criação do contexto com valor inicial
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isTrialActive: false,
  trialDaysRemaining: 0,
  login: async () => {},
  adminLogin: async () => {},
  logout: () => {},
  register: async () => {},
  checkTrialStatus: () => false,
});

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(0);

  // Verificar se há um token salvo no localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Decodificar o token para obter as informações do usuário
        const decoded: any = jwt_decode(storedToken);
        
        // Verificar se o token não expirou
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp > currentTime) {
          setToken(storedToken);
          const userData = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
            organizationId: decoded.organization_id,
            planId: decoded.plan_id,
            isTrialActive: decoded.is_trial_active,
            trialExpirationDate: decoded.trial_expiration_date,
          };
          
          setUser(userData);
          
          // Verificar e atualizar o status do período de teste
          if (userData.isTrialActive && userData.trialExpirationDate) {
            const isActive = checkTrialStatus();
            setIsTrialActive(isActive);
            
            if (isActive) {
              const expirationDate = new Date(userData.trialExpirationDate);
              const today = new Date();
              const diffTime = expirationDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              setTrialDaysRemaining(Math.max(0, diffDays));
            }
          }
          
          // Configurar o token para todas as requisições
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          // Token expirado, fazer logout
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Função para login de organização
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', access_token);
      
      // Decodificar o token para obter as informações do usuário
      const decoded: any = jwt_decode(access_token);
      
      // Atualizar o estado com as informações do usuário
      setToken(access_token);
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: 'organization',
        organizationId: decoded.organization_id,
        planId: decoded.plan_id,
        isTrialActive: decoded.is_trial_active,
        trialExpirationDate: decoded.trial_expiration_date,
      };
      
      setUser(userData);
      
      // Verificar e atualizar o status do período de teste
      if (userData.isTrialActive && userData.trialExpirationDate) {
        const isActive = checkTrialStatus();
        setIsTrialActive(isActive);
        
        if (isActive) {
          const expirationDate = new Date(userData.trialExpirationDate);
          const today = new Date();
          const diffTime = expirationDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setTrialDaysRemaining(Math.max(0, diffDays));
        }
      }
      
      // Configurar o token para todas as requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  // Função para login de administrador
  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/v1/auth/admin/login', { email, password });
      const { access_token } = response.data;
      
      // Salvar token no localStorage
      localStorage.setItem('token', access_token);
      
      // Decodificar o token para obter as informações do usuário
      const decoded: any = jwt_decode(access_token);
      
      // Atualizar o estado com as informações do usuário
      setToken(access_token);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: 'admin',
      });
      
      // Configurar o token para todas as requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    } catch (error) {
      console.error('Erro ao fazer login de administrador:', error);
      throw error;
    }
  };

  // Função para logout
  const logout = () => {
    // Remover token do localStorage
    localStorage.removeItem('token');
    
    // Limpar o estado
    setToken(null);
    setUser(null);
    
    // Remover o token das requisições
    delete axios.defaults.headers.common['Authorization'];
  };

  // Função para verificar o status do período de teste
  const checkTrialStatus = () => {
    if (!user || !user.trialExpirationDate) return false;
    
    const expirationDate = new Date(user.trialExpirationDate);
    const today = new Date();
    
    // Verificar se o período de teste ainda está ativo
    const isActive = expirationDate > today && user.isTrialActive;
    setIsTrialActive(isActive);
    
    if (isActive) {
      // Calcular dias restantes
      const diffTime = expirationDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTrialDaysRemaining(Math.max(0, diffDays));
    } else {
      setTrialDaysRemaining(0);
    }
    
    return isActive;
  };

  // Função para registro de organização
  const register = async (name: string, email: string, password: string) => {
    try {
      // Criar uma data de expiração para o período de teste (14 dias a partir de hoje)
      const trialExpirationDate = new Date();
      trialExpirationDate.setDate(trialExpirationDate.getDate() + 14);
      
      // Incluir informações do plano básico e período de teste no registro
      await axios.post('/api/v1/organizations', { 
        name, 
        email, 
        password,
        planId: 'basic', // Plano básico por padrão
        isTrialActive: true,
        trialExpirationDate: trialExpirationDate.toISOString()
      });
      
      // Após o registro, fazer login automaticamente
      await login(email, password);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  // Verificar se o usuário é um administrador
  const isAdmin = user?.role === 'admin';

  // Valor do contexto
  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin,
    isTrialActive,
    trialDaysRemaining,
    login,
    adminLogin,
    logout,
    register,
    checkTrialStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;