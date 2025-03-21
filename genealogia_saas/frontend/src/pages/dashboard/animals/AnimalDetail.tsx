import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  AccountTree as AccountTreeIcon,
  Pets as PetsIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Tipo para os dados de um animal
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  gender: 'Macho' | 'Fêmea' | 'Indefinido';
  physicalCharacteristics: string | null;
  imageUrl: string | null;
  father: ParentInfo | null;
  mother: ParentInfo | null;
}

// Tipo para informações de pais/mães
interface ParentInfo {
  id: string;
  name: string;
  species: string;
  imageUrl: string | null;
}

const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        // Em um cenário real, isso seria uma chamada à API
        // const response = await axios.get(`/api/v1/animals/${id}`);
        // setAnimal(response.data);
        
        // Simulando dados para demonstração
        setTimeout(() => {
          const mockAnimal: Animal = {
            id: id || 'animal-1',
            name: `Animal ${id}`,
            species: 'Bovino',
            breed: 'Nelore',
            birthDate: '2020-05-15',
            gender: 'Macho',
            physicalCharacteristics: 'Pelagem branca com manchas pretas. Porte médio. Chifres desenvolvidos.',
            imageUrl: 'https://placekitten.com/400/300',
            father: {
              id: 'father-1',
              name: 'Pai 1',
              species: 'Bovino',
              imageUrl: 'https://placekitten.com/200/150'
            },
            mother: {
              id: 'mother-1',
              name: 'Mãe 1',
              species: 'Bovino',
              imageUrl: 'https://placekitten.com/201/151'
            }
          };
          
          setAnimal(mockAnimal);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados do animal:', error);
        setError('Falha ao carregar dados do animal. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchAnimal();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !animal) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Animal não encontrado'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/animals')}
          sx={{ mt: 2 }}
        >
          Voltar para a lista
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard/animals')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Detalhes do Animal
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Informações principais */}
        <Grid item xs={12} md={4}>
          <Card>
            {animal.imageUrl ? (
              <CardMedia
                component="img"
                height="250"
                image={animal.imageUrl}
                alt={animal.name}
              />
            ) : (
              <Box
                sx={{
                  height: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200'
                }}
              >
                <PetsIcon sx={{ fontSize: 80, color: 'grey.400' }} />
              </Box>
            )}
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {animal.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  icon={animal.gender === 'Macho' ? <MaleIcon /> : animal.gender === 'Fêmea' ? <FemaleIcon /> : undefined}
                  label={animal.gender}
                  color={animal.gender === 'Macho' ? 'primary' : animal.gender === 'Fêmea' ? 'secondary' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {animal.species} {animal.breed ? `- ${animal.breed}` : ''}
                </Typography>
              </Box>
              {animal.birthDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Nascimento: {new Date(animal.birthDate).toLocaleDateString('pt-BR')}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  to={`/dashboard/animals/${animal.id}/edit`}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccountTreeIcon />}
                  component={RouterLink}
                  to={`/dashboard/animals/${animal.id}/tree`}
                  fullWidth
                >
                  Ver Árvore Genealógica
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Características e detalhes */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Características Físicas
            </Typography>
            <Typography variant="body1" paragraph>
              {animal.physicalCharacteristics || 'Nenhuma característica física registrada.'}
            </Typography>
          </Paper>

          {/* Genealogia */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Genealogia
            </Typography>
            <Grid container spacing={3}>
              {/* Pai */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Pai
                    </Typography>
                    {animal.father ? (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {animal.father.imageUrl && (
                            <Box
                              component="img"
                              src={animal.father.imageUrl}
                              alt={animal.father.name}
                              sx={{ width: 60, height: 60, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">
                              {animal.father.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {animal.father.species}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          component={RouterLink}
                          to={`/dashboard/animals/${animal.father.id}`}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Não registrado
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Mãe */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Mãe
                    </Typography>
                    {animal.mother ? (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {animal.mother.imageUrl && (
                            <Box
                              component="img"
                              src={animal.mother.imageUrl}
                              alt={animal.mother.name}
                              sx={{ width: 60, height: 60, borderRadius: 1, mr: 2, objectFit: 'cover' }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">
                              {animal.mother.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {animal.mother.species}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          component={RouterLink}
                          to={`/dashboard/animals/${animal.mother.id}`}
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          Ver Detalhes
                        </Button>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Não registrada
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnimalDetail;