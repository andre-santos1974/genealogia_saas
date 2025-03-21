import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // Redirecionar para a página de login se o usuário não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Redirecionar para o dashboard se o usuário não for um administrador
    return <Navigate to="/dashboard" replace />;
  }

  // Renderizar o conteúdo protegido se o usuário estiver autenticado e for um administrador
  return <>{children}</>;
};

export default AdminRoute;