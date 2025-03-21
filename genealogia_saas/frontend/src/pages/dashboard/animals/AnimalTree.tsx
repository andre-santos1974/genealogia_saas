import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import * as d3 from 'd3';

// Tipos para os dados da árvore genealógica
interface AnimalNode {
  id: string;
  name: string;
  gender: 'Macho' | 'Fêmea' | 'Indefinido';
  imageUrl?: string;
  parentId?: string;
  isRoot?: boolean;
}

interface TreeData {
  animal: AnimalNode;
  ancestors: AnimalNode[];
}

const AnimalTree: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [treeData, setTreeData] = useState<TreeData | null>(null);

  // Carregar dados da árvore genealógica
  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        // Em um cenário real, isso seria uma chamada à API
        // const response = await axios.get(`/api/v1/animals/${id}/tree`);
        // setTreeData(response.data);
        
        // Simulando dados para demonstração
        setTimeout(() => {
          const mockTreeData: TreeData = {
            animal: {
              id: id || 'animal-1',
              name: `Animal ${id}`,
              gender: 'Macho',
              isRoot: true
            },
            ancestors: [
              // Pais
              {
                id: 'father-1',
                name: 'Pai 1',
                gender: 'Macho',
                parentId: id
              },
              {
                id: 'mother-1',
                name: 'Mãe 1',
                gender: 'Fêmea',
                parentId: id
              },
              // Avós paternos
              {
                id: 'grandfather-1',
                name: 'Avô Paterno',
                gender: 'Macho',
                parentId: 'father-1'
              },
              {
                id: 'grandmother-1',
                name: 'Avó Paterna',
                gender: 'Fêmea',
                parentId: 'father-1'
              },
              // Avós maternos
              {
                id: 'grandfather-2',
                name: 'Avô Materno',
                gender: 'Macho',
                parentId: 'mother-1'
              },
              {
                id: 'grandmother-2',
                name: 'Avó Materna',
                gender: 'Fêmea',
                parentId: 'mother-1'
              },
              // Bisavós paternos
              {
                id: 'great-grandfather-1',
                name: 'Bisavô Paterno 1',
                gender: 'Macho',
                parentId: 'grandfather-1'
              },
              {
                id: 'great-grandmother-1',
                name: 'Bisavó Paterna 1',
                gender: 'Fêmea',
                parentId: 'grandfather-1'
              }
            ]
          };
          
          setTreeData(mockTreeData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar dados da árvore genealógica:', error);
        setError('Falha ao carregar dados da árvore genealógica. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTreeData();
  }, [id]);

  // Renderizar a árvore genealógica usando D3.js
  useEffect(() => {
    if (!treeData || !svgRef.current) return;

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll('*').remove();

    // Preparar dados para o formato de árvore do D3
    const hierarchyData = {
      id: treeData.animal.id,
      name: treeData.animal.name,
      gender: treeData.animal.gender,
      children: []
    };

    // Função recursiva para construir a hierarquia
    const buildHierarchy = (parentId: string) => {
      return treeData.ancestors
        .filter(node => node.parentId === parentId)
        .map(node => ({
          id: node.id,
          name: node.name,
          gender: node.gender,
          children: buildHierarchy(node.id)
        }));
    };

    // Construir a hierarquia completa
    hierarchyData.children = buildHierarchy(treeData.animal.id);

    // Configurações do gráfico
    const width = 900;
    const height = 600;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };

    // Criar o layout da árvore
    const root = d3.hierarchy(hierarchyData);
    
    // Definir a posição dos nós
    const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    treeLayout(root);

    // Criar o SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Adicionar links (linhas entre os nós)
    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5);

    // Adicionar nós
    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    // Adicionar círculos aos nós
    node.append('circle')
      .attr('r', 10)
      .attr('fill', (d: any) => {
        if (d.data.id === treeData.animal.id) return '#4caf50';
        return d.data.gender === 'Macho' ? '#1976d2' : '#e91e63';
      });

    // Adicionar rótulos (nomes) aos nós
    node.append('text')
      .attr('dy', '.35em')
      .attr('x', (d: any) => d.children ? -13 : 13)
      .attr('text-anchor', (d: any) => d.children ? 'end' : 'start')
      .text((d: any) => d.data.name)
      .attr('font-size', '12px');

  }, [treeData]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !treeData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Dados da árvore genealógica não encontrados'}
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
          onClick={() => navigate(`/dashboard/animals/${id}`)}
          sx={{ mr: 2 }}
        >
          Voltar para detalhes
        </Button>
        <Typography variant="h4" component="h1">
          Árvore Genealógica
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {treeData.animal.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Visualização das relações genealógicas
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ overflowX: 'auto', mt: 3 }}>
          <svg ref={svgRef} style={{ minWidth: '100%', minHeight: '600px' }}></svg>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Legenda
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#4caf50', mr: 1 }} />
              <Typography variant="body2">Animal selecionado</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#1976d2', mr: 1 }} />
              <Typography variant="body2">Macho</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#e91e63', mr: 1 }} />
              <Typography variant="body2">Fêmea</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AnimalTree;