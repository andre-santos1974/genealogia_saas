import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Pets as PetsIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  // Em um cenário real, esses dados viriam de uma API
  const dashboardData = {
    totalOrganizations: 24,
    activeSubscriptions: 18,
    totalPlans: 3,
    totalAnimals: 1250,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Painel Administrativo
      </Typography>
      
      <Grid container spacing={3}>
        {/* Estatísticas */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd',
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Organizações
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalOrganizations}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <BusinessIcon color="primary" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Total de organizações cadastradas
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9',
            }}
          >
            <Typography component="h2" variant="h6" color="success" gutterBottom>
              Assinaturas Ativas
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.activeSubscriptions}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <PeopleIcon color="success" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Organizações com assinaturas ativas
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff8e1',
            }}
          >
            <Typography component="h2" variant="h6" color="warning" gutterBottom>
              Planos
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalPlans}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <ListAltIcon color="warning" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Planos de assinatura disponíveis
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#f3e5f5',
            }}
          >
            <Typography component="h2" variant="h6" color="secondary" gutterBottom>
              Animais
            </Typography>
            <Typography component="p" variant="h4">
              {dashboardData.totalAnimals}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <PetsIcon color="secondary" sx={{ mr: 1 }} />
              <Typography color="text.secondary" variant="body2">
                Total de animais registrados
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Informações adicionais */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Visão Geral do Sistema
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography paragraph>
              Bem-vindo ao painel administrativo do sistema de gerenciamento genealógico para animais.
              Aqui você pode gerenciar organizações, planos de assinatura e visualizar estatísticas do sistema.
            </Typography>
            <Typography paragraph>
              Use o menu lateral para navegar entre as diferentes seções administrativas.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;