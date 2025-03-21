import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

// Função para validar CPF
const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

// Função para validar CNPJ
const validarCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
};

// Função para formatar CPF
const formatarCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/([\d]{3})([\d]{3})([\d]{3})([\d]{2})/, '$1.$2.$3-$4');
  return cpf;
};

// Função para formatar CNPJ
const formatarCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/\D/g, '');
  cnpj = cnpj.replace(/([\d]{2})([\d]{3})([\d]{3})([\d]{4})([\d]{2})/, '$1.$2.$3/$4-$5');
  return cnpj;
};

// Tema personalizado com cores mais modernas
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Azul mais moderno no lugar do verde
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f50057', // Rosa/vermelho para acentos
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    h6: {
      fontWeight: 500,
      letterSpacing: 0.25,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#3f51b5',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 3px 5px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [documentType, setDocumentType] = useState('cnpj'); // 'cnpj' ou 'cpf'

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      documentType: 'cnpj',
      documentNumber: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Nome é obrigatório'),
      email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
      password: Yup.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .required('Senha é obrigatória'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'As senhas não conferem')
        .required('Confirmação de senha é obrigatória'),
      documentType: Yup.string()
        .required('Tipo de documento é obrigatório'),
      documentNumber: Yup.string()
        .required('Número do documento é obrigatório')
        .test('validDocument', 'Documento inválido', function(value) {
          const { documentType } = this.parent;
          if (!value) return false;
          if (documentType === 'cpf') {
            return validarCPF(value);
          } else {
            return validarCNPJ(value);
          }
        }),
      cep: Yup.string()
        .required('CEP é obrigatório')
        .matches(/^\d{5}-\d{3}$|^\d{8}$/, 'Formato de CEP inválido'),
      logradouro: Yup.string()
        .required('Logradouro é obrigatório'),
      numero: Yup.string()
        .required('Número é obrigatório'),
      bairro: Yup.string()
        .required('Bairro é obrigatório'),
      cidade: Yup.string()
        .required('Cidade é obrigatória'),
      estado: Yup.string()
        .required('Estado é obrigatório')
    }),
    onSubmit: async (values) => {
      try {
        setError(null);
        // Aqui você precisaria modificar a função register para incluir os novos campos
        // Por enquanto, vamos manter a chamada original para não quebrar a funcionalidade existente
        await register(values.name, values.email, values.password);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Falha no registro. Tente novamente.');
      }
    },
  });

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    if (!cep || cep.length < 8) return;
    
    cep = cep.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    try {
      setLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        formik.setFieldValue('logradouro', data.logradouro || '');
        formik.setFieldValue('bairro', data.bairro || '');
        formik.setFieldValue('cidade', data.localidade || '');
        formik.setFieldValue('estado', data.uf || '');
        // Foca no campo número após preencher o endereço
        document.getElementById('numero')?.focus();
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  // Efeito para atualizar o tipo de documento no formik quando o estado mudar
  useEffect(() => {
    formik.setFieldValue('documentType', documentType);
  }, [documentType]);

  // Handler para formatar o documento conforme digita
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (documentType === 'cpf') {
      value = formatarCPF(value);
    } else {
      value = formatarCNPJ(value);
    }
    formik.setFieldValue('documentNumber', value);
  };

  // Handler para formatar o CEP conforme digita
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.substring(0, 8);
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }
    formik.setFieldValue('cep', value);
    
    // Buscar CEP quando tiver 8 dígitos
    if (value.replace(/\D/g, '').length === 8) {
      buscarEnderecoPorCep(value);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: '100%', 
              borderRadius: 2,
              background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)'
            }}
          >
            <Typography 
              component="h1" 
              variant="h5" 
              align="center" 
              gutterBottom
              color="primary"
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Registro de {documentType === 'cnpj' ? 'Organização' : 'Pessoa Física'}
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label={documentType === 'cnpj' ? "Nome da Organização" : "Nome Completo"}
                    name="name"
                    autoComplete={documentType === 'cnpj' ? "organization" : "name"}
                    autoFocus
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
                    <Select
                      labelId="document-type-label"
                      id="documentType"
                      value={documentType}
                      label="Tipo de Documento"
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <MenuItem value="cnpj">CNPJ</MenuItem>
                      <MenuItem value="cpf">CPF</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="documentNumber"
                    label={documentType === 'cnpj' ? "CNPJ" : "CPF"}
                    name="documentNumber"
                    value={formik.values.documentNumber}
                    onChange={handleDocumentChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.documentNumber && Boolean(formik.errors.documentNumber)}
                    helperText={formik.touched.documentNumber && formik.errors.documentNumber}
                    placeholder={documentType === 'cnpj' ? "00.000.000/0000-00" : "000.000.000-00"}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Senha"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar Senha"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mt: 1, 
                      mb: 2,
                      color: 'primary.main',
                      fontWeight: 500 
                    }}
                  >
                    Endereço
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="cep"
                    label="CEP"
                    name="cep"
                    value={formik.values.cep}
                    onChange={handleCepChange}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      if (formik.values.cep.replace(/\D/g, '').length === 8) {
                        buscarEnderecoPorCep(formik.values.cep);
                      }
                    }}
                    error={formik.touched.cep && Boolean(formik.errors.cep)}
                    helperText={formik.touched.cep && formik.errors.cep}
                    InputProps={{
                      endAdornment: loadingCep ? <CircularProgress color="primary" size={20} /> : null,
                    }}
                    placeholder="00000-000"
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    required
                    fullWidth
                    id="logradouro"
                    label="Logradouro"
                    name="logradouro"
                    value={formik.values.logradouro}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.logradouro && Boolean(formik.errors.logradouro)}
                    helperText={formik.touched.logradouro && formik.errors.logradouro}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="numero"
                    label="Número"
                    name="numero"
                    value={formik.values.numero}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.numero && Boolean(formik.errors.numero)}
                    helperText={formik.touched.numero && formik.errors.numero}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    id="complemento"
                    label="Complemento"
                    name="complemento"
                    value={formik.values.complemento}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.complemento && Boolean(formik.errors.complemento)}
                    helperText={formik.touched.complemento && formik.errors.complemento}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="bairro"
                    label="Bairro"
                    name="bairro"
                    value={formik.values.bairro}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.bairro && Boolean(formik.errors.bairro)}
                    helperText={formik.touched.bairro && formik.errors.bairro}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    id="cidade"
                    label="Cidade"
                    name="cidade"
                    value={formik.values.cidade}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.cidade && Boolean(formik.errors.cidade)}
                    helperText={formik.touched.cidade && formik.errors.cidade}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <TextField
                    required
                    fullWidth
                    id="estado"
                    label="UF"
                    name="estado"
                    value={formik.values.estado}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.estado && Boolean(formik.errors.estado)}
                    helperText={formik.touched.estado && formik.errors.estado}
                    inputProps={{ maxLength: 2 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  py: 1.2,
                  fontSize: '1rem',
                  borderRadius: 1.5,
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)',
                  }
                }}
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Registrando...' : 'Registrar'}
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link 
                    component={RouterLink} 
                    to="/login" 
                    variant="body2"
                    color="primary"
                    sx={{ 
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {"Já tem uma conta? Faça login"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;