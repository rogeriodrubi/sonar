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

2. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

Preencha o arquivo `.env.local` com suas credenciais do Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase

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

## Próximos Passos

Consulte `TASKS.md` para ver as tarefas pendentes. As próximas etapas incluem:
- Configuração do banco de dados (migrations)
- Implementação da autenticação
- Criação das páginas do dashboard
