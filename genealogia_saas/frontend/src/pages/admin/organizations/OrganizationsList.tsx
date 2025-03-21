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
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

// Interface para os dados de uma organização
interface Organization {
  id: string;
  name: string;
  email: string;
  cnpj: string | null;
  subscriptionPlanId: string;
  subscriptionPlanName: string;
  subscriptionDate: string;
  subscriptionStatus: 'Ativa' | 'Inativa' | 'Pendente';
}

const OrganizationsList: React.FC = () => {
  // Estado para armazenar as organizações
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Fazenda Boa Vista',
      email: 'contato@boavista.com',
      cnpj: '12.345.678/0001-90',
      subscriptionPlanId: '1',
      subscriptionPlanName: 'Premium',
      subscriptionDate: '2023-01-15',
      subscriptionStatus: 'Ativa',
    },
    {
      id: '2',
      name: 'Haras Esperança',
      email: 'admin@harasesperanca.com',
      cnpj: '98.765.432/0001-21',
      subscriptionPlanId: '2',
      subscriptionPlanName: 'Básico',
      subscriptionDate: '2023-02-20',
      subscriptionStatus: 'Ativa',
    },
    {
      id: '3',
      name: 'Canil São Francisco',
      email: 'contato@canilsaofrancisco.com',
      cnpj: '45.678.901/0001-23',
      subscriptionPlanId: '3',
      subscriptionPlanName: 'Profissional',
      subscriptionDate: '2023-03-10',
      subscriptionStatus: 'Pendente',
    },
    {
      id: '4',
      name: 'Associação de Criadores',
      email: 'info@associacaocriadores.org',
      cnpj: '34.567.890/0001-45',
      subscriptionPlanId: '1',
      subscriptionPlanName: 'Premium',
      subscriptionDate: '2023-01-05',
      subscriptionStatus: 'Inativa',
    },
  ]);

  // Estado para o diálogo de confirmação de exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<string | null>(null);

  // Estado para o diálogo de edição/criação
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<Partial<Organization> | null>(null);
  const [isNewOrganization, setIsNewOrganization] = useState(false);

  // Opções para o status da assinatura
  const subscriptionStatusOptions = ['Ativa', 'Inativa', 'Pendente'];

  // Opções para os planos de assinatura
  const subscriptionPlans = [
    { id: '1', name: 'Premium' },
    { id: '2', name: 'Básico' },
    { id: '3', name: 'Profissional' },
  ];

  // Função para abrir o diálogo de exclusão
  const handleOpenDeleteDialog = (id: string) => {
    setOrganizationToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Função para fechar o diálogo de exclusão
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrganizationToDelete(null);
  };

  // Função para confirmar a exclusão
  const handleConfirmDelete = () => {
    if (organizationToDelete) {
      // Em um cenário real, isso seria uma chamada à API
      // await axios.delete(`/api/v1/organizations/${organizationToDelete}`);
      
      // Atualizar o estado local removendo a organização
      setOrganizations(organizations.filter(org => org.id !== organizationToDelete));
      handleCloseDeleteDialog();
    }
  };

  // Função para abrir o diálogo de edição
  const handleOpenEditDialog = (organization?: Organization) => {
    if (organization) {
      setCurrentOrganization({ ...organization });
      setIsNewOrganization(false);
    } else {
      setCurrentOrganization({
        name: '',
        email: '',
        cnpj: '',
        subscriptionPlanId: '',
        subscriptionStatus: 'Pendente',
        subscriptionDate: new Date().toISOString().split('T')[0],
      });
      setIsNewOrganization(true);
    }
    setEditDialogOpen(true);
  };

  // Função para fechar o diálogo de edição
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setCurrentOrganization(null);
  };

  // Função para salvar a organização (criar ou atualizar)
  const handleSaveOrganization = () => {
    if (currentOrganization) {
      if (isNewOrganization) {
        // Em um cenário real, isso seria uma chamada à API para criar
        // const response = await axios.post('/api/v1/organizations', currentOrganization);
        
        // Simulando a criação com um ID gerado
        const newOrganization: Organization = {
          ...currentOrganization as Organization,
          id: `${organizations.length + 1}`,
          subscriptionPlanName: subscriptionPlans.find(plan => plan.id === currentOrganization.subscriptionPlanId)?.name || '',
        };
        
        setOrganizations([...organizations, newOrganization]);
      } else {
        // Em um cenário real, isso seria uma chamada à API para atualizar
        // await axios.put(`/api/v1/organizations/${currentOrganization.id}`, currentOrganization);
        
        // Atualizar o estado local
        setOrganizations(organizations.map(org => 
          org.id === currentOrganization.id 
            ? {
                ...currentOrganization as Organization,
                subscriptionPlanName: subscriptionPlans.find(plan => plan.id === currentOrganization.subscriptionPlanId)?.name || '',
              } 
            : org
        ));
      }
      
      handleCloseEditDialog();
    }
  };

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name && currentOrganization) {
      setCurrentOrganization({
        ...currentOrganization,
        [name]: value,
      });
    }
  };

  // Função para obter a cor do chip de status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Inativa':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom component="div">
          Gerenciar Organizações
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenEditDialog()}
        >
          Nova Organização
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell>Data de Assinatura</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.email}</TableCell>
                <TableCell>{organization.cnpj || '-'}</TableCell>
                <TableCell>{organization.subscriptionPlanName}</TableCell>
                <TableCell>
                  {new Date(organization.subscriptionDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={organization.subscriptionStatus}
                    color={getStatusColor(organization.subscriptionStatus) as 'success' | 'warning' | 'error' | 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Visualizar">
                    <IconButton size="small" color="primary">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenEditDialog(organization)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(organization.id)}
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
            Tem certeza que deseja excluir esta organização? Esta ação não pode ser desfeita.
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
          {isNewOrganization ? 'Nova Organização' : 'Editar Organização'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="name"
                  value={currentOrganization?.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={currentOrganization?.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  name="cnpj"
                  value={currentOrganization?.cnpj || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Plano de Assinatura</InputLabel>
                  <Select
                    name="subscriptionPlanId"
                    value={currentOrganization?.subscriptionPlanId || ''}
                    onChange={handleInputChange}
                    label="Plano de Assinatura"
                    required
                  >
                    {subscriptionPlans.map((plan) => (
                      <MenuItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data de Assinatura"
                  name="subscriptionDate"
                  type="date"
                  value={currentOrganization?.subscriptionDate || ''}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status da Assinatura</InputLabel>
                  <Select
                    name="subscriptionStatus"
                    value={currentOrganization?.subscriptionStatus || 'Pendente'}
                    onChange={handleInputChange}
                    label="Status da Assinatura"
                    required
                  >
                    {subscriptionStatusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveOrganization} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrganizationsList;