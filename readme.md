# 🚀 Projeto Restaurante Saboroso 📱📞🍣🥘

Este projeto é um acompanhamento do progresso no curso **Projeto Restaurante Saboroso 📱📞🍣🥘**, que consiste na criação de um clone do WhatsApp utilizando tecnologias modernas de desenvolvimento web. O curso possui **50 aulas**.

## 📌 Funcionalidades

O projeto tem como objetivo principal a construção de um sistema de gestão de reservas, com as seguintes funcionalidades:

- **Criação de menus para exibir no site**
- **Recebimento de contatos via formulário**
- **Gerenciamento de contatos**
- **Envio de notificações em tempo real**
- **Integração com WhatsApp para envio de mensagem ao realizar uma reserva**
- **Dashboard para acompanhamento de reservas**


## 🛠 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **Node.js**: Ambiente de execução para JavaScript no backend.
- **Express**: Framework para criação do servidor backend.
- **MySQL2**: Cliente MySQL para Node.js com suporte a Promises.
- **Socket.io**: Para comunicação em tempo real entre clientes e servidor.
- **Axios**: Para requisições HTTP assíncronas no front-end.
- **Redis**: Utilizado com `connect-redis` para gerenciamento de sessões.
- **EJS**: Motor de templates para renderização de páginas dinâmicas.
- **Moment.js**: Para manipulação de datas e horários.
- **Morgan**: Middleware para registro de requisições HTTP no servidor.
- **Formidable**: Para o processamento de uploads de arquivos.
- **SweetAlert2**: Para exibição de alertas bonitos e personalizáveis.
- **Cookie-parser**: Para manipulação de cookies na aplicação.
- **HTTP-errors**: Para tratamento de erros HTTP no Express.


## 📂 Estrutura do Projeto

```
📦 nome-do-projeto
├── 📂 bin              # Scripts de inicialização do servidor
│   ├── www            # Arquivo principal para iniciar o servidor
├── 📂 inc              # Arquivos de configuração e utilitários
│   ├── Pagination.js  # Script para paginação de dados
├── 📂 public           # Arquivos estáticos
│   ├── 📂 admin       # Arquivos do painel administrativo
│   ├── 📂 css         # Arquivos de estilo
│   ├── 📂 db          # Base de dados (se aplicável)
│   ├── 📂 fonts       # Arquivos de fontes
│   ├── 📂 images      # Imagens do projeto
│   ├── 📂 js          # Scripts JavaScript
│   ├── favicon.ico    # Ícone do site
├── 📂 routes           # Definições de rotas da aplicação
│   ├── admin.js       # Rotas administrativas
│   ├── index.js       # Rotas principais
│   ├── users.js       # Rotas de usuários
├── 📂 views            # Páginas renderizadas pelo EJS
│   ├── 📂 admin       # Páginas do painel administrativo
│   ├── 📂 inc         # Componentes reutilizáveis
│   ├── contacts.ejs   # Página de contatos
│   ├── error.ejs      # Página de erro
│   ├── index.ejs      # Página inicial
│   ├── menus.ejs      # Página de menus
│   ├── reservations.ejs # Página de reservas
│   ├── services.ejs   # Página de serviços
├── .gitignore         # Arquivo para ignorar arquivos no Git
├── app.js             # Arquivo principal do aplicativo
├── package-lock.json  # Gerenciamento de dependências
├── package.json       # Configurações e dependências do projeto
├── readme.md          # Documentação do projeto
```

## 📦 Pacotes Instalados

### Dependências:

```json
"dependencies": {
    "axios": "^0.16.2",
    "connect-redis": "^3.4.2",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "ejs": "~2.6.1",
    "express": "^4.15.2",
    "express-session": "^1.16.2",
    "formidable": "^1.2.1",
    "http-errors": "~1.6.3",
    "moment": "^2.30.1",
    "morgan": "~1.9.1",
    "mysql2": "^1.7.0",
    "socket.io": "^4.8.1",
    "sweetalert2": "^11.17.2",
  }
```

## 🔧 Como Rodar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/DevPatriick/Projeto_Restaurante_Saboroso

2. **Instale as dependências:**

   ```bash
npm install

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start

4. **Acesse o projeto no navegador:**
    Abra o navegador e acesse o seguinte endereço: http://localhost:3000



## Rotas publicas 🚀

### Rotas Principais
- **GET /**  
  Retorna a página inicial do restaurante com todos os menus. 👨‍🍳

### Rotas de Contato 📞
- **GET /contacts**  
  Retorna o formulário de contato. 📝

- **POST /contacts**  
  Salva um novo contato. Os dados são enviados no corpo da requisição. Envia uma notificação para o dashboard. 💬

### Rotas de Menu 🍽️
- **GET /menus**  
  Retorna todos os menus cadastrados. 📜

### Rotas de Reservas 📅
- **GET /reservations**  
  Retorna o formulário de reservas. 📝

- **POST /reservations**  
  Cria uma nova reserva. Os dados são enviados no corpo da requisição. Após a criação, envia uma notificação via WhatsApp. 📲

### Rotas de Assinatura 📧
- **POST /subscribe**  
  Adiciona um novo e-mail para a lista de assinantes. Dados enviados no corpo da requisição. 📬


## Mensagens e Notificações 📲
Ao criar ou atualizar reservas, é possível que o sistema envie notificações via WhatsApp usando a API do Z-API. A notificação inclui a confirmação da reserva para o cliente. ✅


## Rotas da administração 🚀

### Rotas Principais
- **GET admin/**  
  Retorna a página inicial  👋

### Rotas de Usuário 👤
- **GET admin/users**  
  Retorna todos os usuários cadastrados. 📋

- **POST admin/users**  
  Adiciona um novo usuário. Dados enviados no corpo da requisição. ➕

- **GET admin/users/:id**  
  Retorna um usuário específico com base no `id`. 🔍

- **PUT admin/users/:id**  
  Atualiza um usuário específico com base no `id`. Dados enviados no corpo da requisição. ✏️

- **DELETE admin/users/:id**  
  Remove um usuário específico com base no `id`. 🗑️

### Rotas de Menu 🍽️
- **GET admin/menus**  
  Retorna todos os menus. 📜

- **POST admin/menus**  
  Adiciona um novo menu. Requer upload de arquivo de imagem (usando Formidable). 📷

- **DELETE admin/menus/:id**  
  Remove um menu específico com base no `id`. 🗑️

### Rotas de Contato 📞
- **GET admin/contacts**  
  Retorna todos os contatos. 📋

- **DELETE admin/contacts/:id**  
  Remove um contato específico com base no `id`. 🗑️

### Rotas de E-mail 📧
- **GET admin/emails**  
  Retorna todos os e-mails cadastrados. 📜

- **DELETE admin/emails/:id**  
  Remove um e-mail específico com base no `id`. 🗑️

### Rotas de Reservas 📅
- **GET admin/reservations**  
  Retorna todas as reservas, podendo ser filtrado por `start` e `end` através de parâmetros de consulta. 🔍

- **POST admin/reservations**  
  Cria uma nova reserva. Dados enviados no corpo da requisição. ➕

- **DELETE admin/reservations/:id**  
  Remove uma reserva específica com base no `id`. 🗑️

- **GET admin/reservations/chart**  
  Retorna os dados de reservas em formato de gráfico. 📊


## Autenticação 🔐
As rotas estão protegidas por uma verificação de sessão. Se a sessão do usuário não estiver ativa, ele será redirecionado para a página de login (`/admin/login`). 🚪



## 🚀 Bora codar! 😎
