import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  AccountTree as AccountTreeIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

// Tipo para os dados de um animal
interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  gender: 'Macho' | 'Fêmea' | 'Indefinido';
  hasParents: boolean;
  imageUrl: string | null;
}

const AnimalsList: React.FC = () => {
  // Estados para a tabela e paginação
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Carregar dados dos animais (simulado)
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        // Em um cenário real, isso seria uma chamada à API
        // const response = await axios.get('/api/v1/animals');
        // setAnimals(response.data);
        
        // Simulando dados para demonstração
        setTimeout(() => {
          const mockAnimals: Animal[] = Array.from({ length: 35 }, (_, index) => ({
            id: `animal-${index + 1}`,
            name: `Animal ${index + 1}`,
            species: index % 3 === 0 ? 'Bovino' : index % 3 === 1 ? 'Equino' : 'Canino',
            breed: index % 4 === 0 ? null : `Raça ${index % 5 + 1}`,
            birthDate: index % 5 === 0 ? null : new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 5).toISOString().split('T')[0],
            gender: index % 3 === 0 ? 'Macho' : index % 3 === 1 ? 'Fêmea' : 'Indefinido',
            hasParents: index % 2 === 0,
            imageUrl: index % 7 === 0 ? `https://placekitten.com/200/${200 + index % 10}` : null
          }));
          
          setAnimals(mockAnimals);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar animais:', error);
        setError('Falha ao carregar a lista de animais. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  // Manipuladores de eventos para paginação
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manipuladores de eventos para filtros
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSpeciesFilterChange = (event: SelectChangeEvent) => {
    setSpeciesFilter(event.target.value);
    setPage(0);
  };

  const handleGenderFilterChange = (event: SelectChangeEvent) => {
    setGenderFilter(event.target.value);
    setPage(0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Filtrar animais com base nos critérios de busca e filtros
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (animal.breed && animal.breed.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecies = speciesFilter === 'all' || animal.species === speciesFilter;
    const matchesGender = genderFilter === 'all' || animal.gender === genderFilter;
    
    return matchesSearch && matchesSpecies && matchesGender;
  });

  // Obter animais para a página atual
  const paginatedAnimals = filteredAnimals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Obter lista única de espécies para o filtro
  const speciesList = ['all', ...new Set(animals.map(animal => animal.species))];

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Animais
        </Typography>
        <Button
          component={RouterLink}
          to="/dashboard/animals/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Novo Animal
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: '40%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={toggleFilters}
          >
            Filtros
          </Button>
        </Box>

        {showFilters && (
          <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="species-filter-label">Espécie</InputLabel>
                <Select
                  labelId="species-filter-label"
                  id="species-filter"
                  value={speciesFilter}
                  label="Espécie"
                  onChange={handleSpeciesFilterChange}
                >
                  <MenuItem value="all">Todas as espécies</MenuItem>
                  {speciesList.filter(species => species !== 'all').map(species => (
                    <MenuItem key={species} value={species}>{species}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="gender-filter-label">Sexo</InputLabel>
                <Select
                  labelId="gender-filter-label"
                  id="gender-filter"
                  value={genderFilter}
                  label="Sexo"
                  onChange={handleGenderFilterChange}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="Macho">Macho</MenuItem>
                  <MenuItem value="Fêmea">Fêmea</MenuItem>
                  <MenuItem value="Indefinido">Indefinido</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabela de animais">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Espécie</TableCell>
              <TableCell>Raça</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Sexo</TableCell>
              <TableCell>Genealogia</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAnimals.length > 0 ? (
              paginatedAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell component="th" scope="row">
                    {animal.name}
                  </TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.breed || '-'}</TableCell>
                  <TableCell>{animal.birthDate ? new Date(animal.birthDate).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={animal.gender} 
                      size="small" 
                      color={animal.gender === 'Macho' ? 'primary' : animal.gender === 'Fêmea' ? 'secondary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {animal.hasParents ? (
                      <Chip 
                        icon={<AccountTreeIcon />} 
                        label="Disponível" 
                        size="small" 
                        color="success"
                      />
                    ) : (
                      <Chip 
                        label="Não disponível" 
                        size="small" 
                        color="default"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Visualizar">
                      <IconButton 
                        component={RouterLink} 
                        to={`/dashboard/animals/${animal.id}`}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton 
                        component={RouterLink} 
                        to={`/dashboard/animals/${animal.id}/edit`}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {animal.hasParents && (
                      <Tooltip title="Árvore Genealógica">
                        <IconButton 
                          component={RouterLink} 
                          to={`/dashboard/animals/${animal.id}/tree`}
                          size="small"
                        >
                          <AccountTreeIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum animal encontrado com os critérios de busca atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAnimals.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Itens por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Container>
  );
};

export default AnimalsList;