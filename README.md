# Hub-Connector

## Objetivo

O Hub-Connector tem como propósito atuar como um ponto central de integração entre sistemas legados e plataformas modernas. A solução disponibiliza uma API para que o sistema legado possa enviar informações, e o Hub se encarrega de direcionar esses dados para o destino correto, de acordo com a rota configurada.

Além do encaminhamento de dados, o projeto oferece:

- Monitoramento completo das transações, com visualização detalhada de logs.
- Painel de suporte, permitindo o acompanhamento em tempo real das integrações.
- Gestão de rotas, possibilitando que administradores e desenvolvedores cadastrem e configurem novos destinos com facilidade.

## Funcionalidades

### Criação de usuário
- [x] Deve ser possível realizar a criação de um novo usuário;
- [x] Deve ser possível alterer as informações (Nome de Usuário, E-mail, Nome);
- [ ] Deve ser possível realizar a alteração de senha do usuário (Enviando a nova senha por email);
- [x] Deve ser possível inativar um usuário cadastrado;

#### Autenticação e Validação:

- [x] Deve ser possível Realizar Login;
- [x] Deve ser possível recuperar os dados do usuário pelo token;
- [x] Deve ser possível realizar o controle de permissões de acesso (ADMIN, USER, DEV);

#### Criação de Rotas:
  
- [ ] Deve ser possível realizar a criação de novas rotas (para usuários com permissão);
- [ ] Deve ser possível realizar alterar uma rota já existente;
- [ ] Deve ser possível inativar uma rota existente;
  
#### Monitoração das Rotas

- [ ] Deve ser possível consultar uma transação pelo JobID;
- [ ] Deve ser possível realizar a consulta des transações pela rota;
- [ ] Deve ser possível criar categorias para separar as rotas;



## Configuração do Sistema e instalação

### Configuração da Chave Pública/Privada

````
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:4096
openssl rsa -pubout -in private.key -out public.key
````
