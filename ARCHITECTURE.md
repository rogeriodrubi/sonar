# Sonar — Arquitetura

## Visão Geral

Aplicação web full-stack construída em Next.js com App Router, usando Supabase como backend completo (banco, auth, storage) e hospedada na Vercel.

```
Browser
  └── Next.js (App Router, Vercel)
        ├── Server Components → leitura de dados via Supabase SDK
        ├── Route Handlers (/api) → operações sensíveis e uploads
        └── Client Components → interações, player, gravação

Supabase
  ├── Auth → JWT, magic link, convites
  ├── Postgres → todos os dados relacionais
  └── Storage → arquivos de áudio e transcrições
```

## Estrutura de Pastas

```
sonar/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── convite/[token]/
│   ├── (dashboard)/
│   │   ├── layout.tsx          # sidebar + auth guard
│   │   ├── pacientes/
│   │   │   ├── page.tsx        # lista de pacientes
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # linha do tempo
│   │   │       └── sessoes/[sessaoId]/page.tsx
│   │   └── sessoes/
│   │       └── nova/page.tsx
│   └── api/
│       ├── sessoes/route.ts
│       └── upload/route.ts
├── components/
│   ├── ui/                     # shadcn/ui base
│   ├── sessao/
│   │   ├── AudioPlayer.tsx
│   │   ├── GravadorAudio.tsx
│   │   └── AnotacaoEditor.tsx
│   └── paciente/
│       └── LinhaDoTempo.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # browser client
│   │   ├── server.ts           # server client (cookies)
│   │   └── middleware.ts        # helper usado pelo middleware raiz
│   └── utils.ts
├── middleware.ts                  # middleware Next.js (raiz do projeto)
├── types/
│   └── index.ts                # tipos globais
└── supabase/
    └── migrations/             # migrations SQL
```

## Modelo de Dados

```sql
-- Perfis (extende auth.users do Supabase)
profiles (
  id uuid references auth.users primary key,
  nome text,
  tipo text check (tipo in ('terapeuta', 'paciente')),
  avatar_url text,
  created_at timestamptz
)

-- Relação terapeuta ↔ paciente
terapeutas_pacientes (
  id uuid primary key,
  terapeuta_id uuid references profiles,
  paciente_id uuid references profiles,
  ativo boolean default true,
  created_at timestamptz
)

-- Sessões
sessoes (
  id uuid primary key,
  terapeuta_id uuid references profiles,
  paciente_id uuid references profiles,
  data_sessao timestamptz,
  duracao_minutos int,
  audio_url text,          -- path no Supabase Storage
  transcricao text,
  created_at timestamptz
)

-- Anotações (separadas por autor)
anotacoes (
  id uuid primary key,
  sessao_id uuid references sessoes,
  autor_id uuid references profiles,
  conteudo text,           -- JSON do editor rico (tiptap)
  updated_at timestamptz
)
```

## Segurança (Row Level Security)

- Terapeuta só acessa sessões onde `terapeuta_id = auth.uid()`
- Paciente só acessa sessões onde `paciente_id = auth.uid()`
- Anotações: `SELECT` restrito a `autor_id = auth.uid()`
- Storage bucket `audios`: policy baseada em `sessao_id` da sessão vinculada

## Decisões de Arquitetura

**Por que App Router e Server Components?**
Dados sensíveis nunca ficam expostos no bundle do cliente. Queries ao Supabase rodam no servidor.

**Por que não usar API routes para tudo?**
Server Components reduzem round-trips desnecessários. API routes apenas para uploads e operações com side-effects.

**Por que Tiptap para anotações?**
Editor rico open-source com boa integração com React e suporte a autosave simples via `onUpdate`.
