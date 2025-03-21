import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Autocomplete,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';

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
  fatherId: string | null;
  motherId: string | null;
}

// Tipo para as opções de pais/mães
interface ParentOption {
  id: string;
  name: string;
  species: string;
}

const AnimalForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Opções para os selects
  const speciesOptions = ['Bovino', 'Equino', 'Canino', 'Felino', 'Ovino', 'Caprino', 'Suíno', 'Outro'];
  const genderOptions = ['Macho', 'Fêmea', 'Indefinido'];

  // Estados para as opções de pais e mães
  const [fatherOptions, setFatherOptions] = useState<ParentOption>();
  const [motherOptions, setMotherOptions] = useState<ParentOption>();
  const [loadingParents, setLoadingParents] = useState(false);

  // Estado para a imagem selecionada
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Inicializar o formulário com Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      species: '',
      breed: '',
      birthDate: '',
      gender: '',
      physicalCharacteristics: '',
      fatherId: null,
      motherId: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome é obrigatório'),
      species: Yup.string().required('Espécie é obrigatória'),
      breed: Yup.string(),
      birthDate: Yup.date().nullable(),
      gender: Yup.string().required('Sexo é obrigatório'),
      physicalCharacteristics: Yup.string(),
      fatherId: Yup.string().nullable(),
      motherId: Yup.string().nullable()
    }),
    onSubmit: async (values) => {
      try {
        setSaveLoading(true);
        setError(null);

        // Preparar os dados para envio
        const animalData = {
          ...values,
          // Adicionar outros campos conforme necessário
        };

        // Em um cenário real, isso seria uma chamada à API
        // const response = await axios.post('/api/v1/animals', animalData);
        // ou para edição: await axios.put(`/api/v1/animals/${id}`, animalData);

        // Simulando uma chamada à API bem-sucedida
        setTimeout(() => {
          setSuccessMessage(`Animal ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
          setSaveLoading(false);

          // Redirecionar após um breve delay
          setTimeout(() => {
            navigate('/dashboard/animals');
          }, 1500);
        }, 1000);
      } catch (error) {
        console.error('Erro ao salvar animal:', error);
        setError(`Falha ao ${isEditMode ? 'atualizar' : 'cadastrar'} o animal. Tente novamente.`);
        setSaveLoading(false);
      }
    },
  });

  // Carregar dados do animal se estiver no modo de edição
  useEffect(() => {
    if (isEditMode && id) {
      const fetchAnimal = async () => {
        try {
          // Em um cenário real, isso seria uma chamada à API
          // const response = await axios.get(`/api/v1/animals/${id}`);
          // const animalData = response.data;

          // Simulando dados para demonstração
          setTimeout(() => {
            const mockAnimal: Animal = {
              id: id,
              name: `Animal ${id}`,
              species: 'Bovino',
              breed: 'Nelore',
              birthDate: '2020-05-15',
              gender: 'Macho',
              physicalCharacteristics: 'Pelagem branca com manchas pretas',
              imageUrl: 'https://placekitten.com/300/200',
              fatherId: 'father-1',
              motherId: 'mother-1'
            };

            // Preencher o formulário com os dados do animal
            formik.setValues({
              name: mockAnimal.name,
              species: mockAnimal.species,
              breed: mockAnimal.breed || '',
              birthDate: mockAnimal.birthDate || '',
              gender: mockAnimal.gender,
              physicalCharacteristics: mockAnimal.physicalCharacteristics || '',
              fatherId: mockAnimal.fatherId,
              motherId: mockAnimal.motherId
            });

            // Definir a URL da imagem para preview
            if (mockAnimal.imageUrl) {
              setPreviewUrl(mockAnimal.imageUrl);
            }

            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Erro ao carregar dados do animal:', error);
          setError('Falha ao carregar dados do animal. Tente novamente mais tarde.');
          setLoading(false);
        }
      };

      fetchAnimal();
    }
  }, [id, isEditMode]);

  // Carregar opções de pais e mães quando a espécie for selecionada
  useEffect(() => {
    if (formik.values.species) {
      const fetchParentOptions = async () => {
        setLoadingParents(true);
        try {
          // Em um cenário real, isso seria uma chamada à API
          // const response = await axios.get(`/api/v1/animals?species=${formik.values.species}&gender=Macho`);
          // setFatherOptions(response.data);

          // Simulando dados para demonstração
          setTimeout(() => {
            // Gerar opções de pais (machos)
            const mockFathers: ParentOption= Array.from({ length: 10 }, (_, index) => ({
              id: `father-${index + 1}`,
              name: `Pai ${index + 1}`,
              species: formik.values.species
            }));

            // Gerar opções de mães (fêmeas)
            const mockMothers: ParentOption= Array.from({ length: 10 }, (_, index) => ({
              id: `mother-${index + 1}`,
              name: `Mãe ${index + 1}`,
              species: formik.values.species
            }));

            setFatherOptions(mockFathers);
            setMotherOptions(mockMothers);
            setLoadingParents(false);
          }, 800);
        } catch (error) {
          console.error('Erro ao carregar opções de pais:', error);
          setLoadingParents(false);
        }
      };

      fetchParentOptions();
    }
  }, [formik.values.species]);

  // Manipulador para seleção de imagem
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);

      // Criar URL para preview da imagem
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
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
          {isEditMode ? 'Editar Animal' : 'Novo Animal'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Nome"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.species && Boolean(formik.errors.species)}>
                    <InputLabel id="species-label">Espécie</InputLabel>
                    <Select
                      labelId="species-label"
                      id="species"
                      name="species"
                      value={formik.values.species}
                      label="Espécie"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {speciesOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.species && formik.errors.species && (
                      <FormHelperText>{formik.errors.species}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="breed"
                    name="breed"
                    label="Raça"
                    value={formik.values.breed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.breed && Boolean(formik.errors.breed)}
                    helperText={formik.touched.breed && formik.errors.breed}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="birthDate"
                    name="birthDate"
                    label="Data de Nascimento"
                    type="date"
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.birthDate && Boolean(formik.errors.birthDate)}
                    helperText={formik.touched.birthDate && formik.errors.birthDate}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={formik.touched.gender && Boolean(formik.errors.gender)}>
                    <InputLabel id="gender-label">Sexo</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={formik.values.gender}
                      label="Sexo"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.gender && formik.errors.gender && (
                      <FormHelperText>{formik.errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="physicalCharacteristics"
                    name="physicalCharacteristics"
                    label="Características Físicas"
                    multiline
                    rows={4}
                    value={formik.values.physicalCharacteristics}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.physicalCharacteristics && Boolean(formik.errors.physicalCharacteristics)}
                    helperText={formik.touched.physicalCharacteristics && formik.errors.physicalCharacteristics}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Genealogia
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="fatherId"
                      options={fatherOptions}
                      loading={loadingParents}
                      getOptionLabel={(option) => option.name}
                      value={fatherOptions.find(option => option.id === formik.values.fatherId) || null}
                      onChange={(_, newValue) => {
                        formik.setFieldValue('fatherId', newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Pai"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingParents ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="motherId"
                      options={motherOptions}
                      loading={loadingParents}
                      getOptionLabel={(option) => option.name}
                      value={motherOptions.find(option => option.id === formik.values.motherId) || null}
                      onChange={(_, newValue) => {
                        formik.setFieldValue('motherId', newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Mãe"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingParents ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Imagem
              </Typography>

              <Card sx={{ mb: 2 }}>
                {previewUrl ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={previewUrl}
                    alt="Preview da imagem"
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma imagem selecionada
                    </Typography>
                  </Box>
                )}
                <CardContent>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    Selecionar Imagem
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </CardContent>
              </Card>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<SaveIcon />}
                disabled={formik.isSubmitting || saveLoading}
                sx={{ mt: 2 }}
              >
                {saveLoading ? 'Salvando...' : isEditMode ? 'Atualizar Animal' : 'Cadastrar Animal'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AnimalForm;