import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { Pets as PetsIcon, Paid as PaidIcon, DateRange as DateRangeIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Tipo para os dados da organização
interface OrganizationData {
  name: string;
  plan: {
    name: string;
    animalLimit: number;
  };
  animalCount: number;
  subscriptionStatus: string;
  subscriptionDate: string;
}

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);

  useEffect(() => {
    // Simulação de carregamento de dados da API
    const fetchData = async () => {
      try {
        // Em um cenário real, isso seria uma chamada à API
        // await axios.get('/api/v1/organizations/current')
        
        // Simulando dados para demonstração
        setTimeout(() => {
          setOrganizationData({
            name: user?.name || 'Organização',
            plan: {
              name: 'Profissional',
              animalLimit: 200
            },
            animalCount: 45,
            subscriptionStatus: 'Ativa',
            subscriptionDate: '2023-05-15'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados da organização:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!organizationData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Erro ao carregar dados da organização. Tente novamente mais tarde.
        </Typography>
      </Container>
    );
  }

  // Calcular a porcentagem de uso do limite de animais
  const usagePercentage = (organizationData.animalCount / organizationData.plan.animalLimit) * 100;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Card de boas-vindas */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Bem-vindo, {organizationData.name}!
            </Typography>
            <Typography variant="body1">
              Gerencie seus registros genealógicos de animais de forma eficiente e organizada.
            </Typography>
          </Paper>
        </Grid>

        {/* Cards de estatísticas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PetsIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                <Typography variant="h6">Animais Cadastrados</Typography>
              </Box>
              <Typography variant="h3" align="center" sx={{ my: 2 }}>
                {organizationData.animalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Limite do plano: {organizationData.plan.animalLimit} animais
              </Typography>
              <Box sx={{ mt: 2, position: 'relative', height: 10, bgcolor: 'grey.200', borderRadius: 5 }}>
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${Math.min(usagePercentage, 100)}%`,
                    bgcolor: usagePercentage > 80 ? 'error.main' : 'primary.main',
                    borderRadius: 5
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                {usagePercentage.toFixed(1)}% utilizado
              </Typography>
              <Button 
                component={RouterLink} 
                to="/dashboard/animals"
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Gerenciar Animais
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaidIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                <Typography variant="h6">Plano Atual</Typography>
              </Box>
              <Typography variant="h4" align="center" sx={{ my: 2 }}>
                {organizationData.plan.name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">
                Status: <span style={{ color: organizationData.subscriptionStatus === 'Ativa' ? 'green' : 'red', fontWeight: 'bold' }}>{organizationData.subscriptionStatus}</span>
              </Typography>
              <Button 
                component={RouterLink} 
                to="/plans"
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Alterar Plano
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DateRangeIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                <Typography variant="h6">Assinatura</Typography>
              </Box>
              <Typography variant="body1" align="center" sx={{ my: 2 }}>
                Data de início: {new Date(organizationData.subscriptionDate).toLocaleDateString('pt-BR')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sua assinatura está ativa e será renovada automaticamente.
              </Typography>
              <Button 
                variant="outlined" 
                color="secondary"
                fullWidth 
                sx={{ mt: 2 }}
              >
                Histórico de Pagamentos
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Seção de ações rápidas */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ações Rápidas
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/dashboard/animals/new"
                  variant="contained" 
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Cadastrar Novo Animal
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  component={RouterLink} 
                  to="/dashboard/animals"
                  variant="outlined" 
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Listar Animais
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Exportar Dados
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Configurações
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardHome;