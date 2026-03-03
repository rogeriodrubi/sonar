# Sonar

Plataforma web para gravar, armazenar e explorar sessões de psicoterapia.

## Stack

- **Next.js 14+** com App Router e TypeScript strict
- **Supabase** para auth, banco (Postgres) e storage
- **Tailwind CSS + shadcn/ui** para UI
- **Tiptap** para editor de texto rico (a ser instalado)

## Setup

1. Instale as dependências:
```bash
npm install
```

2. Configure o Supabase:
   
   **📖 Consulte o guia completo**: [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
   
   Resumo rápido:
   - Crie um projeto no [Supabase](https://supabase.com)
   - Crie o arquivo `.env.local` na raiz do projeto com:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - Execute as migrations SQL do projeto (veja `SUPABASE_SETUP.md` para detalhes)

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

Consulte `ARCHITECTURE.md` para detalhes sobre a estrutura de pastas e arquitetura.

## Documentação

- `SPEC.md` - Especificação geral do projeto
- `PRD.md` - Product Requirements Document
- `ARCHITECTURE.md` - Arquitetura e estrutura técnica
- `SKILLS.md` - Padrões de implementação
- `TASKS.md` - Lista de tarefas

## Documentação Adicional

- `SUPABASE_SETUP.md` - **Guia completo de configuração do Supabase** ⭐
- `TASKS.md` - Lista de tarefas e progresso
- `ARCHITECTURE.md` - Arquitetura e estrutura técnica
- `SPEC.md` - Especificação geral do projeto
- `PRD.md` - Product Requirements Document
- `SKILLS.md` - Padrões de implementação
