-- Migration: Criar tabela terapeutas_pacientes
-- Descrição: Relação entre terapeutas e seus pacientes

create table public.terapeutas_pacientes (
  id uuid default gen_random_uuid() primary key,
  terapeuta_id uuid references public.profiles(id) on delete cascade not null,
  paciente_id uuid references public.profiles(id) on delete cascade not null,
  ativo boolean default true not null,
  created_at timestamptz default now() not null,
  -- Garantir que um terapeuta não tenha o mesmo paciente duplicado
  unique(terapeuta_id, paciente_id)
);

-- Índices para consultas comuns
create index idx_terapeutas_pacientes_terapeuta on public.terapeutas_pacientes(terapeuta_id);
create index idx_terapeutas_pacientes_paciente on public.terapeutas_pacientes(paciente_id);
create index idx_terapeutas_pacientes_ativo on public.terapeutas_pacientes(ativo) where ativo = true;

-- Comentários nas colunas
comment on table public.terapeutas_pacientes is 'Relação entre terapeutas e seus pacientes';
comment on column public.terapeutas_pacientes.id is 'ID único da relação';
comment on column public.terapeutas_pacientes.terapeuta_id is 'ID do terapeuta';
comment on column public.terapeutas_pacientes.paciente_id is 'ID do paciente';
comment on column public.terapeutas_pacientes.ativo is 'Se a relação está ativa (paciente arquivado = false)';
comment on column public.terapeutas_pacientes.created_at is 'Data de criação da relação';
