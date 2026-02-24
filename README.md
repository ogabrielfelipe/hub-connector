# Hub-Connector

Monorepo contendo a API backend e o frontend React do Hub-Connector.

## Estrutura do Projeto

```
hub-connector/
├── api/              # Backend API (Node.js + Fastify)
├── frontend/         # Frontend React (Vite + TypeScript)
├── .husky/           # Git hooks (global para ambos projetos)
├── commitlint.config.cjs  # Configuração do Commitlint (global)
└── package.json      # Dependências globais (Husky + Commitlint)
```

## Objetivo

O Hub-Connector tem como propósito atuar como um ponto central de integração entre sistemas legados e plataformas modernas. A solução disponibiliza uma API para que o sistema legado possa enviar informações, e o Hub se encarrega de direcionar esses dados para o destino correto, de acordo com a rota configurada.

Além do encaminhamento de dados, o projeto oferece:

- Monitoramento completo das transações, com visualização detalhada de logs.
- Painel de suporte, permitindo o acompanhamento em tempo real das integrações.
- Gestão de rotas, possibilitando que administradores e desenvolvedores cadastrem e configurem novos destinos com facilidade.

## Começando

### Pré-requisitos

- Node.js 18+
- pnpm 10+
- Docker e Docker Compose

### Instalação Inicial

1. **Instale as dependências globais (Husky + Commitlint):**

```bash
pnpm install
```

2. **Configure e inicie a API:**

```bash
cd api
pnpm install
docker-compose up -d  # Inicia MongoDB, Redis, OpenSearch
pnpm run dev:http
```

Veja mais detalhes em [api/README.md](./api/README.md)

3. **Configure e inicie o Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Scripts Disponíveis (Raiz)

Execute estes comandos da raiz do projeto:

### API
- `pnpm run api:dev` - Inicia servidor HTTP da API
- `pnpm run api:dev:worker` - Inicia worker da API
- `pnpm run api:test` - Executa testes da API
- `pnpm run api:test:unit` - Executa testes unitários
- `pnpm run api:test:e2e` - Executa testes E2E
- `pnpm run api:lint` - Executa linter
- `pnpm run api:lint:fix` - Corrige erros de lint
- `pnpm run api:format` - Formata código

### Frontend
- `pnpm run frontend:dev` - Inicia servidor de desenvolvimento
- `pnpm run frontend:build` - Build de produção
- `pnpm run frontend:preview` - Preview do build

## Git Hooks

Este projeto usa Husky e Commitlint configurados globalmente:

- **commit-msg**: Valida mensagens de commit seguindo Conventional Commits
- **pre-push**: Executa lint, format e testes unitários da API antes do push

## Funcionalidades

### Criação de usuário

- [x] Deve ser possível realizar a criação de um novo usuário (Usuário: ADMIN);
- [x] Deve ser possível alterer as informações (Nome de Usuário, E-mail, Nome) (Usuário: ADMIN; Somente o próprio registro: DEV, USER);
- [x] Deve ser possível inativar um usuário cadastrado (Usuário: ADMIN; Somente o próprio registro: DEV, USER);


### Autenticação e Validação:

- [x] Deve ser possível Realizar Login;
- [x] Deve ser possível recuperar os dados do usuário pelo token;
- [x] Deve ser possível realizar o controle de permissões de acesso;
- [ ] Deve ser possível realizar login por meio de SSO (Google e GitHub);

### Criação de Rotas:

- [x] Deve ser possível criar categorias para separar as rotas (Usuários: ADMIN, DEV);
- [x] Deve ser possível realizar a criação de novas rotas (Usuários: ADMIN, DEV);
- [x] Deve ser possível realizar alterar uma rota já existente (Usuários: ADMIN, DEV);

### Monitoração das Rotas

- [x] Deve ser possível realizar a consulta des transações pela rota, categoria, status e payload (Usuários: ADMIN, DEV, USER);

## Licença

ISC
