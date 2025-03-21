import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Interface para os dados de um plano de assinatura
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  animalLimit: number;
  description: string;
  features: string[];
}

const PlansList: React.FC = () => {
  // Estado para armazenar os planos
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'Básico',
      price: 49.90,
      animalLimit: 50,
      description: 'Ideal para pequenos criadores',
      features: ['Cadastro de até 50 animais', 'Visualização de árvore genealógica básica', 'Suporte por email'],
    },
    {
      id: '2',
      name: 'Profissional',
      price: 99.90,
      animalLimit: 200,
      description: 'Perfeito para criadores de médio porte',
      features: ['Cadastro de até 200 animais', 'Árvore genealógica avançada', 'Relatórios básicos', 'Suporte prioritário'],
    },
    {
      id: '3',
      name: 'Premium',
      price: 199.90,
      animalLimit: 1000,
      description: 'Para grandes criadores e associações',
      features: ['Cadastro de até 1000 animais', 'Árvore genealógica completa', 'Relatórios avançados', 'Suporte 24/7', 'API de integração'],
    },
  ]);

  // Estado para o diálogo de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Estado para o diálogo de edição/criação
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [featuresInput, setFeaturesInput] = useState<string>('');

  // Função para abrir o diálogo de exclusão
  const handleOpenDeleteDialog = (id: string) => {
    setPlanToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Função para fechar o diálogo de exclusão
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = () => {
    if (planToDelete) {
      // Em um cenário real, isso seria uma chamada à API
      // await axios.delete(`/api/v1/plans/${planToDelete}`);
      
      // Atualizar o estado local removendo o plano
      setPlans(plans.filter(plan => plan.id !== planToDelete));
      handleCloseDeleteDialog();
    }
  };

  // Função para abrir o diálogo de edição
  const handleOpenEditDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setCurrentPlan({ ...plan });
      setFeaturesInput(plan.features.join('\n'));
      setIsNewPlan(false);
    } else {
      setCurrentPlan({
        name: '',
        price: 0,
        animalLimit: 0,
        description: '',
        features: [],
      });
      setFeaturesInput('');
      setIsNewPlan(true);
    }
    setEditDialogOpen(true);
  };

  // Função para fechar o diálogo de edição
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentPlan(null);
    setFeaturesInput('');
  };

  // Função para salvar o plano (criar ou atualizar)
  const handleSavePlan = () => {
    if (currentPlan) {
      // Processar as features do textarea para um array
      const featuresArray = featuresInput
        .split('\n')
        .map(feature => feature.trim())
        .filter(feature => feature !== '');

      const updatedPlan = {
        ...currentPlan,
        features: featuresArray,
      };

      if (isNewPlan) {
        // Em um cenário real, isso seria uma chamada à API para criar
        // const response = await axios.post('/api/v1/plans', updatedPlan);
        
        // Simulando a criação com um ID gerado
        const newPlan: SubscriptionPlan = {
          ...updatedPlan as SubscriptionPlan,
          id: `${plans.length + 1}`,
        };
        
        setPlans([...plans, newPlan]);
      } else {
        // Em um cenário real, isso seria uma chamada à API para atualizar
        // await axios.put(`/api/v1/plans/${currentPlan.id}`, updatedPlan);
        
        // Atualizar o estado local
        setPlans(plans.map(plan => 
          plan.id === currentPlan.id 
            ? { ...updatedPlan as SubscriptionPlan } 
            : plan
        ));
      }
      
      handleCloseEditDialog();
    }
  };

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name && currentPlan) {
      if (name === 'price' || name === 'animalLimit') {
        setCurrentPlan({
          ...currentPlan,
          [name]: Number(value),
        });
      } else if (name === 'features') {
        setFeaturesInput(value);
      } else {
        setCurrentPlan({
          ...currentPlan,
          [name]: value,
        });
      }
    }
  };

  // Função para formatar o preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom component="div">
          Gerenciar Planos de Assinatura
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenEditDialog()}
        >
          Novo Plano
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Limite de Animais</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{formatPrice(plan.price)}</TableCell>
                <TableCell>{plan.animalLimit}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenEditDialog(plan)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(plan.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edição/criação */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isNewPlan ? 'Novo Plano de Assinatura' : 'Editar Plano de Assinatura'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="name"
                  value={currentPlan?.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="price"
                  type="number"
                  value={currentPlan?.price || ''}
                  onChange={handleInputChange}
                  InputProps={{ startAdornment: 'R$' }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Limite de Animais"
                  name="animalLimit"
                  type="number"
                  value={currentPlan?.animalLimit || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={currentPlan?.description || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Funcionalidades (uma por linha)"
                  name="features"
                  multiline
                  rows={4}
                  value={featuresInput}
                  onChange={handleInputChange}
                  helperText="Digite cada funcionalidade em uma linha separada"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSavePlan} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PlansList;