# 🚗 Aplicação de Gestão de Concessionária

Um projeto Full-Stack completo construído com Nest.js e Next.js para gerir as operações de uma concessionária de veículos, incluindo catálogo, clientes, funcionários e vendas.

## Tabela de Conteúdos
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack de Tecnologias](#stack-de-tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar a Aplicação](#como-executar-a-aplicação)
- [Visão Geral da API](#visão-geral-da-api)

## Visão Geral
Esta aplicação simula um sistema real onde diferentes tipos de utilizadores (Clientes, Funcionários e Gerentes) podem interagir com a plataforma de acordo com as suas permissões. Gerentes têm controlo total, funcionários podem gerir veículos e vendas, e clientes podem visualizar o catálogo.

## Funcionalidades
- 🔐 **Autenticação e Autorização:** Sistema de login seguro com Tokens JWT com tempo de expiração configurável.
- 👤 **Controlo de Acesso Baseado em Funções (RBAC):**
  - **Gerente:** Acesso total, incluindo gestão de funcionários.
  - **Funcionário:** Gestão de veículos, clientes e registo de vendas.
  - **Cliente:** Acesso de visualização ao catálogo (funcionalidade a ser expandida).
- 🚗 **CRUD de Veículos:** Criação, leitura, atualização e exclusão de veículos no catálogo.
- 🧑‍🤝‍🧑 **CRUD de Utilizadores:** Gestão de Clientes e Funcionários.
- 📈 **CRUD de Vendas:** Registo e visualização de histórico de vendas.

## Stack de Tecnologias

### Backend
- **Framework:** [Nest.js](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Base de Dados:** [MongoDB](https://www.mongodb.com/) (com [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **ODM:** [Mongoose](https://mongoosejs.com/)
- **Autenticação:** [Passport.js](http://www.passportjs.org/) (com estratégias JWT)
- **Validação:** `class-validator` e `class-transformer`

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)

## Estrutura do Projeto
O projeto utiliza uma arquitetura de monorepo com duas pastas principais:
- `/server`: Contém toda a aplicação backend em Nest.js.
- `/client`: Contém toda a aplicação frontend em Next.js.

## Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Git](https://git-scm.com/)
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para a base de dados.

## Instalação e Configuração

Siga estes passos para configurar o ambiente de desenvolvimento local.

**1. Clone o Repositório**
```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd concessionaria-mongo-app
```

**2. Configure o Backend**

   **a. Navegue para a pasta do servidor:**
   ```bash
   cd server
   ```

   **b. Instale as dependências:**
   ```bash
   npm install
   ```

   **c. Crie o arquivo de variáveis de ambiente:**
   Crie um arquivo chamado `.env` na raiz da pasta `/server`. Este arquivo guardará as suas chaves secretas.

   **Arquivo: `/server/.env`**
   ```
   MONGO_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/concessionaria?retryWrites=true&w=majority
   JWT_SECRET=SuaStringSuperSecretaAqui123!
   ```
   - **`MONGO_URI`**: Obtenha no site do MongoDB Atlas.
   - **`JWT_SECRET`**: Crie qualquer string longa e aleatória para a segurança do token.

   **d. Modifique os Módulos para Usar o `.env`:**
   Para que o Nest.js leia o arquivo `.env`, é necessário que o `ConfigModule` esteja importado no `app.module.ts` e que o `JwtModule` seja configurado para ler a variável.

   **Arquivo: `/server/src/app.module.ts`**
   ```typescript
   // ...
   import { ConfigModule } from '@nestjs/config';
   
   @Module({
     imports: [
       ConfigModule.forRoot({ isGlobal: true }), // Garanta que isto está aqui
       MongooseModule.forRoot(process.env.MONGO_URI), // Mude para ler do .env
       // ... outros módulos
     ],
     // ...
   })
   export class AppModule {}
   ```
   
   **Arquivo: `/server/src/auth/auth.module.ts`**
   ```typescript
    // ...
    import { ConfigModule, ConfigService } from '@nestjs/config';
    
    @Module({
      imports: [
        // ...
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '1d' },
          }),
          inject: [ConfigService],
        }),
      ],
      // ...
    })
    export class AuthModule {}
   ```

**3. Configure o Frontend**

   **a. Navegue para a pasta do cliente (num novo terminal):**
   ```bash
   cd client
   ```

   **b. Instale as dependências:**
   ```bash
   npm install
   ```

## Como Executar a Aplicação
Para executar a aplicação, precisará de **dois terminais** abertos simultaneamente.

**Terminal 1: Executar o Backend**
```bash
# Na pasta /server
npm run start:dev
```
> O servidor backend estará disponível em `http://localhost:7654` (ou a porta que configurou).

**Terminal 2: Executar o Frontend**
```bash
# Na pasta /client
npm run dev
```
> A aplicação frontend estará disponível em `http://localhost:3001`.

## Visão Geral da API

| Método | Endpoint                | Descrição                                 | Autenticação Requerida | Permissão Mínima        |
|--------|-------------------------|-------------------------------------------|------------------------|-------------------------|
| `POST` | `/auth/login`           | Autentica um utilizador e retorna um token JWT.| Não                    | N/A                     |
| `GET`  | `/`                     | Endpoint de "saúde" da API.               | Não                    | N/A                     |
| `GET`  | `/funcionarios`         | Lista todos os funcionários e gerentes.   | Sim (Bearer Token)     | Gerente                 |
| `POST` | `/funcionarios`         | Cria um novo funcionário ou gerente.      | Sim (Bearer Token)     | Gerente                 |
| `GET`  | `/clientes`             | Lista todos os clientes.                  | Sim (Bearer Token)     | Funcionário             |
| `POST` | `/clientes`             | Cria um novo cliente.                     | Sim (Bearer Token)     | Funcionário             |
| `GET`  | `/veiculos`             | Lista todos os veículos.                  | Sim (Bearer Token)     | Qualquer utilizador logado |
| `POST` | `/veiculos`             | Adiciona um novo veículo.                 | Sim (Bearer Token)     | Funcionário             |
| `POST` | `/sales`                | Regista uma nova venda.                   | Sim (Bearer Token)     | Funcionário             |

