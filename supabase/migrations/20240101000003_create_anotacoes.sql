-- Migration: Criar tabela anotacoes
-- Descrição: Anotações separadas de terapeuta e paciente sobre sessões

create table public.anotacoes (
  id uuid default gen_random_uuid() primary key,
  sessao_id uuid references public.sessoes(id) on delete cascade not null,
  autor_id uuid references public.profiles(id) on delete cascade not null,
  conteudo jsonb not null,
  updated_at timestamptz default now() not null,
  -- Garantir que cada autor tenha apenas uma anotação por sessão
  unique(sessao_id, autor_id)
);

-- Índices para consultas comuns
create index idx_anotacoes_sessao on public.anotacoes(sessao_id);
create index idx_anotacoes_autor on public.anotacoes(autor_id);
-- Índice GIN para busca em conteúdo JSONB (futuro)
create index idx_anotacoes_conteudo on public.anotacoes using gin(conteudo);

-- Trigger para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_anotacoes_updated_at
  before update on public.anotacoes
  for each row
  execute function update_updated_at_column();

-- Comentários nas colunas
comment on table public.anotacoes is 'Anotações separadas de terapeuta e paciente sobre sessões';
comment on column public.anotacoes.id is 'ID único da anotação';
comment on column public.anotacoes.sessao_id is 'ID da sessão relacionada';
comment on column public.anotacoes.autor_id is 'ID do autor da anotação (terapeuta ou paciente)';
comment on column public.anotacoes.conteudo is 'Conteúdo da anotação em formato JSON (Tiptap)';
comment on column public.anotacoes.updated_at is 'Data da última atualização da anotação';
