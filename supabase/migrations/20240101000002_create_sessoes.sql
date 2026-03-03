-- Migration: Criar tabela sessoes
-- Descrição: Sessões terapêuticas vinculadas a terapeuta e paciente

create table public.sessoes (
  id uuid default gen_random_uuid() primary key,
  terapeuta_id uuid references public.profiles(id) on delete cascade not null,
  paciente_id uuid references public.profiles(id) on delete cascade not null,
  data_sessao timestamptz not null,
  duracao_minutos integer,
  audio_url text,
  transcricao text,
  created_at timestamptz default now() not null
);

-- Índices para consultas comuns
create index idx_sessoes_terapeuta on public.sessoes(terapeuta_id);
create index idx_sessoes_paciente on public.sessoes(paciente_id);
create index idx_sessoes_data_sessao on public.sessoes(data_sessao desc);
-- Índice composto para linha do tempo do paciente
create index idx_sessoes_paciente_data on public.sessoes(paciente_id, data_sessao desc);

-- Comentários nas colunas
comment on table public.sessoes is 'Sessões terapêuticas gravadas';
comment on column public.sessoes.id is 'ID único da sessão';
comment on column public.sessoes.terapeuta_id is 'ID do terapeuta responsável';
comment on column public.sessoes.paciente_id is 'ID do paciente da sessão';
comment on column public.sessoes.data_sessao is 'Data e hora da sessão';
comment on column public.sessoes.duracao_minutos is 'Duração da sessão em minutos';
comment on column public.sessoes.audio_url is 'Path do arquivo de áudio no Supabase Storage';
comment on column public.sessoes.transcricao is 'Transcrição textual da sessão';
comment on column public.sessoes.created_at is 'Data de criação do registro';
