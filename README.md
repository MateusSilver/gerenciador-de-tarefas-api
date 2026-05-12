# Projeto de Next.js 14 com api

## Como começar

Primeiro rode o servidor:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) com o navegador para ver o resultado.

comece editando `app/page.tsx`. a página faz atualizações automaticas conforme a edição.

Esse projeto usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar automaticamente e carregar [Geist](https://vercel.com/font), a nova familia de fontes de texto da vercel.

# Sistema de Gerenciamento de Tarefas API

Este projeto é um Sistema de Gerenciamento de Tarefas com autenticação. O objetivo é retomar e consolidar habilidades de desenvolvimento web fullstack, cobrindo todos os pilares essenciais de uma aplicação moderna em produção.

## Progresso do Projeto

Marque os itens conforme for avançando nas semanas:

- [x] Fase 1: Setup e Banco de Dados - Banco criado no Neon, schema definido, migrations rodando e dados de seed visíveis no Prisma Studio.
- [x] Fase 2: API REST - Todos os endpoints (GET, POST, PATCH, DELETE) funcionando e testados via Thunder Client ou Insomnia.
- [x] Fase 3: Autenticação - Login com Google funcionando; usuário só acessa as próprias tarefas.
- [ ] Fase 4: Frontend - Dashboard completo, responsivo e funcionando com dados reais do banco.
- [ ] Fase 5: Qualidade e Deploy - Aplicação publicada na Vercel com URL pública, código formatado, 1 teste de integração e README documentado.

---

## Objetivos de Aprendizado

- [ ] Reativar o raciocínio de modelagem de banco de dados relacional com Prisma e PostgreSQL
- [ ] Praticar criação e consumo de APIs REST tipadas com TypeScript e Zod
- [ ] Dominar o App Router do Next.js 14+ (Server Components vs Client Components)
- [ ] Implementar autenticação OAuth real com NextAuth.js
- [ ] Publicar aplicação em produção com deploy na Vercel

---

## Stack Tecnológica

- [ ] Framework: Next.js 14+ (App Router)
- [ ] Linguagem: TypeScript
- [ ] ORM e Banco de Dados: Prisma + PostgreSQL (Neon)
- [ ] Autenticação: NextAuth.js (Auth.js v5)
- [ ] Validação de Dados: Zod
- [ ] Estilização: Tailwind CSS
- [ ] Deploy: Vercel + Neon

---

## Configuração Inicial e Variáveis de Ambiente

- [ ] Para rodar o projeto localmente, crie um arquivo `.env` na raiz do repositório baseado no `.env.example`, preenchendo as seguintes chaves:

```env
# Banco de Dados (Neon)
DATABASE_URL=""

# NextAuth (gerar secret com: openssl rand -base64 32)
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```
