# SaaS de Organização Genealógica

Um sistema de gerenciamento genealógico para animais desenvolvido como um Software as a Service (SaaS).

## Descrição

Este projeto é um SaaS que permite organizações gerenciarem registros genealógicos de animais. O sistema inclui:

- Gerenciamento de organizações e seus planos de assinatura
- Cadastro e gerenciamento de animais com informações genealógicas
- Visualização de árvores genealógicas
- Painel administrativo para gerenciamento da plataforma

## Tecnologias

- Backend: Python com FastAPI
- Banco de Dados: PostgreSQL
- Frontend: React com TypeScript
- Autenticação: JWT (JSON Web Tokens)

## Estrutura do Projeto

```
genealogica_saas/
├── backend/              # API e lógica de negócios
│   ├── app/             # Código da aplicação
│   │   ├── api/         # Endpoints da API
│   │   ├── core/        # Configurações centrais
│   │   ├── db/          # Modelos e conexão com banco de dados
│   │   ├── schemas/     # Esquemas Pydantic
│   │   └── services/    # Lógica de negócios
│   ├── tests/           # Testes automatizados
│   └── requirements.txt # Dependências do backend
├── frontend/            # Interface do usuário
│   ├── public/          # Arquivos estáticos
│   ├── src/             # Código fonte React
│   └── package.json     # Dependências do frontend
└── docker-compose.yml   # Configuração para desenvolvimento local
```

## Instalação e Execução

### Pré-requisitos

- Python 3.8+
- PostgreSQL
- Node.js 14+

### Configuração do Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

### Configuração do Frontend

```bash
cd frontend
npm install
npm start
```

## Funcionalidades

- Cadastro e gerenciamento de organizações
- Planos de assinatura com diferentes limites
- Cadastro e gerenciamento de animais
- Visualização de árvores genealógicas
- Painel administrativo
- Simulação de pagamentos