import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Paper,
  Chip
} from '@mui/material';
import { Check as CheckIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Tipos para os planos
interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  animalLimit: number;
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
}

const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isTrialActive, trialDaysRemaining, user } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  
  // Verificar se deve mostrar o banner de período de teste
  useEffect(() => {
    // Mostrar o banner se o usuário estiver autenticado e em período de teste
    // ou se não estiver autenticado (para novos usuários)
    setShowTrialBanner(!isAuthenticated || (isAuthenticated && isTrialActive));
  }, [isAuthenticated, isTrialActive]);

  // Dados dos planos (simulados)
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      price: 49.90,
      animalLimit: 50,
      description: 'Ideal para pequenas organizações',
      features: [
        { name: 'Cadastro de animais', included: true },
        { name: 'Árvore genealógica básica', included: true },
        { name: 'Exportação de dados', included: false },
        { name: 'Relatórios avançados', included: false },
        { name: 'Suporte prioritário', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 99.90,
      animalLimit: 200,
      description: 'Para organizações em crescimento',
      recommended: true,
      features: [
        { name: 'Cadastro de animais', included: true },
        { name: 'Árvore genealógica avançada', included: true },
        { name: 'Exportação de dados', included: true },
        { name: 'Relatórios avançados', included: true },
        { name: 'Suporte prioritário', included: false },
      ]
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 199.90,
      animalLimit: 1000,
      description: 'Para grandes organizações',
      features: [
        { name: 'Cadastro de animais', included: true },
        { name: 'Árvore genealógica avançada', included: true },
        { name: 'Exportação de dados', included: true },
        { name: 'Relatórios avançados', included: true },
        { name: 'Suporte prioritário', included: true },
      ]
    }
  ];

  // Função para lidar com a assinatura de um plano
  const handleSubscribe = (plan: Plan) => {
    if (!isAuthenticated) {
      // Se não estiver autenticado, redirecionar para o registro
      // O registro já inclui automaticamente o período de teste de 14 dias
      navigate('/register');
      return;
    }

    // Simulação de assinatura bem-sucedida
    setSnackbarMessage(`Assinatura do plano ${plan.name} simulada com sucesso!`);
    setOpenSnackbar(true);
    
    // Em um cenário real, aqui seria feita uma chamada à API para atualizar o plano do usuário
    // e desativar o período de teste se estiver ativo
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="lg">
      {/* Banner de período de teste */}
      {showTrialBanner && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mt: 4, 
            mb: 2, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            textAlign: 'center'
          }}
        >
          {!isAuthenticated ? (
            <>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Experimente Grátis por 14 Dias!
              </Typography>
              <Typography variant="body1">
                Registre-se agora e tenha acesso a todas as funcionalidades do plano básico sem custo por 14 dias.
                Sem compromisso, cancele quando quiser.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={() => navigate('/register')}
                sx={{ mt: 2, fontWeight: 'bold' }}
              >
                Começar Período de Teste Gratuito
              </Button>
            </>
          ) : isTrialActive ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography variant="h5" fontWeight="bold">
                  Seu período de teste termina em {trialDaysRemaining} {trialDaysRemaining === 1 ? 'dia' : 'dias'}
                </Typography>
              </Box>
              <Typography variant="body1">
                Escolha um plano abaixo para continuar usando nossos serviços após o término do período de teste.
              </Typography>
            </>
          ) : null}
        </Paper>
      )}
      
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Nossos Planos
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Escolha o plano ideal para sua organização
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        {plans.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={6} md={4}>
            <Card 
              elevation={plan.recommended ? 8 : 2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: plan.recommended ? '2px solid #2e7d32' : 'none',
              }}
            >
              {plan.recommended && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 0,
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                  }}
                >
                  Recomendado
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h4" component="h2" align="center">
                  {plan.name}
                </Typography>
                <Typography variant="h3" color="primary" align="center" sx={{ my: 2 }}>
                  R$ {plan.price.toFixed(2)}
                  <Typography variant="caption" color="text.secondary">/mês</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" paragraph>
                  {plan.description}
                </Typography>
                <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Limite de {plan.animalLimit} animais
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} dense>
                      <ListItemIcon sx={{ color: feature.included ? 'success.main' : 'text.disabled' }}>
                        <CheckIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature.name} 
                        sx={{ color: feature.included ? 'text.primary' : 'text.disabled' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color={plan.recommended ? 'success' : 'primary'}
                  size="large"
                  onClick={() => handleSubscribe(plan)}
                >
                  {!isAuthenticated ? 'Começar Teste Grátis' : 'Assinar Plano'}
                </Button>
                {!isAuthenticated && (
                  <Typography variant="caption" align="center" sx={{ display: 'block', mt: 1 }}>
                    Inclui 14 dias de teste grátis
                  </Typography>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PlansPage;