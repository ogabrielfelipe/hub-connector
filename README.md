# Hub-Connector

## Objetivo

O Hub-Connector tem como propósito atuar como um ponto central de integração entre sistemas legados e plataformas modernas. A solução disponibiliza uma API para que o sistema legado possa enviar informações, e o Hub se encarrega de direcionar esses dados para o destino correto, de acordo com a rota configurada.

Além do encaminhamento de dados, o projeto oferece:

- Monitoramento completo das transações, com visualização detalhada de logs.
- Painel de suporte, permitindo o acompanhamento em tempo real das integrações.
- Gestão de rotas, possibilitando que administradores e desenvolvedores cadastrem e configurem novos destinos com facilidade.

## Funcionalidades

### Criação de usuário

- [x] Deve ser possível realizar a criação de um novo usuário (Usuário: ADMIN);
- [x] Deve ser possível alterer as informações (Nome de Usuário, E-mail, Nome) (Usuário: ADMIN; Somente o próprio registro: DEV, USER);
- [x] Deve ser possível inativar um usuário cadastrado (Usuário: ADMIN; Somente o próprio registro: DEV, USER);

#### Autenticação e Validação:

- [x] Deve ser possível Realizar Login;
- [x] Deve ser possível recuperar os dados do usuário pelo token;
- [x] Deve ser possível realizar o controle de permissões de acesso;

#### Criação de Rotas:

- [x] Deve ser possível criar categorias para separar as rotas (Usuários: ADMIN, DEV);
- [x] Deve ser possível realizar a criação de novas rotas (Usuários: ADMIN, DEV);
- [x] Deve ser possível realizar alterar uma rota já existente (Usuários: ADMIN, DEV);

#### Monitoração das Rotas

- [ ] Deve ser possível consultar uma transação pelo JobID (Usuários: ADMIN, DEV, USER);
- [ ] Deve ser possível realizar a consulta des transações pela rota, categoria, status e payload (Usuários: ADMIN, DEV, USER);

## Configuração do Sistema e instalação

### Configuração da Chave Pública/Privada

```bash
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:4096
```

```bash
openssl rsa -pubout -in private.key -out public.key
```

### Realizar a instalação das dependencias

```bash
npm install
```

### Realizar a instalação do banco de dados

```bash
docker compose up -d
```
