import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isTrialActive, user, checkTrialStatus } = useAuth();

  // Verificar o status do período de teste quando o componente é montado
  useEffect(() => {
    if (isAuthenticated) {
      checkTrialStatus();
    }
  }, [isAuthenticated, checkTrialStatus]);

  if (!isAuthenticated) {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário tem um plano ativo ou está no período de teste
  // Se o período de teste expirou e não há um plano ativo, redirecionar para a página de planos
  if (user?.role === 'organization' && !isTrialActive && !user?.planId) {
    return <Navigate to="/plans" replace />;
  }

  // Renderizar o conteúdo protegido se o usuário estiver autenticado e tiver acesso
  return <>{children};</>;
};

export default ProtectedRoute;