import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PlansPage from './pages/public/PlansPage';

// Páginas do dashboard da organização
import DashboardHome from './pages/dashboard/DashboardHome';
import AnimalsList from './pages/dashboard/animals/AnimalsList';
import AnimalForm from './pages/dashboard/animals/AnimalForm';
import AnimalDetail from './pages/dashboard/animals/AnimalDetail';

// Páginas administrativas
import AdminDashboard from './pages/admin/AdminDashboard';
import OrganizationsList from './pages/admin/organizations/OrganizationsList';
import PlansList from './pages/admin/plans/PlansList';

// Contexto de autenticação
import { AuthProvider } from './contexts/AuthContext';

// Componentes de proteção de rotas
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/plans" element={<PlansPage />} />
        </Route>
        
        {/* Rotas do dashboard da organização (protegidas) */}
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/animals" element={<AnimalsList />} />
          <Route path="/dashboard/animals/new" element={<AnimalForm />} />
          <Route path="/dashboard/animals/edit/:id" element={<AnimalForm />} />
          <Route path="/dashboard/animals/:id" element={<AnimalDetail />} />
        </Route>
        
        {/* Rotas administrativas (protegidas e restritas a admins) */}
        <Route 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/organizations" element={<OrganizationsList />} />
          <Route path="/admin/plans" element={<PlansList />} />
        </Route>
        
        {/* Rota para redirecionamento de caminhos não encontrados */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;