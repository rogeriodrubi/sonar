-- Migration: Criar tabela profiles
-- Descrição: Perfis de usuários que estendem auth.users do Supabase

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text,
  tipo text not null check (tipo in ('terapeuta', 'paciente')),
  avatar_url text,
  created_at timestamptz default now() not null
);

-- Índice para busca por tipo
create index idx_profiles_tipo on public.profiles(tipo);

-- Comentários nas colunas
comment on table public.profiles is 'Perfis de usuários (terapeutas e pacientes)';
comment on column public.profiles.id is 'ID do usuário (referência a auth.users)';
comment on column public.profiles.nome is 'Nome completo do usuário';
comment on column public.profiles.tipo is 'Tipo de usuário: terapeuta ou paciente';
comment on column public.profiles.avatar_url is 'URL da foto de perfil';
comment on column public.profiles.created_at is 'Data de criação do perfil';
