import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Paper
} from '@mui/material';
import { Pets as PetsIcon, Business as BusinessIcon, AccountTree as AccountTreeIcon } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ py: 8 }}>
      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(63, 81, 181, 0.2) 100%)',
            borderRadius: 4,
            mb: 6,
            boxShadow: '0 8px 32px rgba(63, 81, 181, 0.1)',
            border: '1px solid rgba(63, 81, 181, 0.1)'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Genealogia SaaS
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Gerencie registros genealógicos dos seus animais de forma simples e eficiente
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              component={RouterLink} 
              to="/register"
              sx={{ mx: 1 }}
            >
              Começar Agora
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large" 
              component={RouterLink} 
              to="/plans"
              sx={{ mx: 1 }}
            >
              Ver Planos
            </Button>
          </Box>
        </Box>

        {/* Free Trial Banner */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 6, 
            background: 'linear-gradient(135deg, #3f51b5 0%, #002984 100%)',
            color: 'primary.contrastText',
            textAlign: 'center',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
              pointerEvents: 'none'
            }
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Experimente Grátis por 14 Dias!
          </Typography>
          <Typography variant="body1" paragraph>
            Registre-se agora e tenha acesso a todas as funcionalidades do plano básico sem custo por 14 dias.
            Sem compromisso, cancele quando quiser.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ 
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 50,
              boxShadow: '0 4px 14px rgba(245, 0, 87, 0.4)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(245, 0, 87, 0.6)'
              }
            }}
          >
            Começar Período de Teste Gratuito
          </Button>
        </Paper>

        {/* Features Section */}
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ 
          position: 'relative',
          display: 'inline-block',
          fontWeight: 'bold',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #3f51b5, #f50057)',
            borderRadius: '2px'
          }
        }}>
          Recursos Principais
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: 'linear-gradient(90deg, #3f51b5, #757de8)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PetsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Gerenciamento de Animais
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Cadastre e gerencie informações detalhadas sobre seus animais, incluindo dados genealógicos.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: 'linear-gradient(90deg, #3f51b5, #757de8)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccountTreeIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Árvores Genealógicas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Visualize árvores genealógicas completas para entender as relações entre os animais.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: 'linear-gradient(90deg, #3f51b5, #757de8)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <BusinessIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom>
                  Gestão Organizacional
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Organize seus registros por organização e gerencie diferentes níveis de acesso.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* How It Works Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Como Funciona
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  1. Registre-se
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Crie uma conta para sua organização e escolha o plano que melhor atende às suas necessidades.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  2. Cadastre seus Animais
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Adicione informações detalhadas sobre seus animais, incluindo dados genealógicos.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  3. Visualize e Gerencie
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Acesse árvores genealógicas, relatórios e gerencie todos os seus registros em um só lugar.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Pronto para começar?
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            component={RouterLink} 
            to="/register"
            sx={{ mt: 2 }}
          >
            Criar Conta Agora
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;