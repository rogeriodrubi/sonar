-- Migration: Habilitar Row Level Security em todas as tabelas
-- Descrição: Configura políticas de segurança para garantir isolamento de dados

-- ============================================================================
-- PROFILES
-- ============================================================================

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Política: Usuários podem ver seu próprio perfil
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Política: Usuários podem atualizar seu próprio perfil
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Política: Terapeutas podem ver perfis de seus pacientes
create policy "Therapists can view their patients"
  on public.profiles
  for select
  using (
    exists (
      select 1
      from public.terapeutas_pacientes tp
      where tp.terapeuta_id = auth.uid()
        and tp.paciente_id = profiles.id
        and tp.ativo = true
    )
  );

-- Política: Terapeutas podem ver perfis de pacientes em sessões
-- (permite ver paciente ao visualizar sessão)
create policy "Therapists can view patients from sessions"
  on public.profiles
  for select
  using (
    exists (
      select 1
      from public.sessoes s
      where s.terapeuta_id = auth.uid()
        and s.paciente_id = profiles.id
    )
  );

-- Política: Pacientes podem ver perfil do terapeuta vinculado
create policy "Patients can view their therapist"
  on public.profiles
  for select
  using (
    exists (
      select 1
      from public.terapeutas_pacientes tp
      where tp.paciente_id = auth.uid()
        and tp.terapeuta_id = profiles.id
        and tp.ativo = true
    )
  );

-- ============================================================================
-- TERAPEUTAS_PACIENTES
-- ============================================================================

-- Habilitar RLS
alter table public.terapeutas_pacientes enable row level security;

-- Política: Terapeutas podem ver suas próprias relações
create policy "Therapists can view their patient relationships"
  on public.terapeutas_pacientes
  for select
  using (terapeuta_id = auth.uid());

-- Política: Terapeutas podem criar relações com pacientes
create policy "Therapists can create patient relationships"
  on public.terapeutas_pacientes
  for insert
  with check (terapeuta_id = auth.uid());

-- Política: Terapeutas podem atualizar suas próprias relações
create policy "Therapists can update their patient relationships"
  on public.terapeutas_pacientes
  for update
  using (terapeuta_id = auth.uid());

-- Política: Pacientes podem ver relações onde são o paciente
create policy "Patients can view their therapist relationships"
  on public.terapeutas_pacientes
  for select
  using (paciente_id = auth.uid());

-- ============================================================================
-- SESSOES
-- ============================================================================

-- Habilitar RLS
alter table public.sessoes enable row level security;

-- Política: Terapeutas podem ver sessões onde são o terapeuta
create policy "Therapists can view their sessions"
  on public.sessoes
  for select
  using (terapeuta_id = auth.uid());

-- Política: Terapeutas podem criar sessões
create policy "Therapists can create sessions"
  on public.sessoes
  for insert
  with check (terapeuta_id = auth.uid());

-- Política: Terapeutas podem atualizar suas próprias sessões
create policy "Therapists can update their sessions"
  on public.sessoes
  for update
  using (terapeuta_id = auth.uid());

-- Política: Terapeutas podem deletar suas próprias sessões
create policy "Therapists can delete their sessions"
  on public.sessoes
  for delete
  using (terapeuta_id = auth.uid());

-- Política: Pacientes podem ver sessões onde são o paciente
create policy "Patients can view their sessions"
  on public.sessoes
  for select
  using (paciente_id = auth.uid());

-- ============================================================================
-- ANOTACOES
-- ============================================================================

-- Habilitar RLS
alter table public.anotacoes enable row level security;

-- Política: Usuários podem ver apenas suas próprias anotações
create policy "Users can view own annotations"
  on public.anotacoes
  for select
  using (autor_id = auth.uid());

-- Política: Usuários podem criar anotações apenas para sessões que têm acesso
-- Terapeuta: sessões onde é terapeuta
-- Paciente: sessões onde é paciente
create policy "Users can create annotations for accessible sessions"
  on public.anotacoes
  for insert
  with check (
    autor_id = auth.uid()
    and (
      exists (
        select 1
        from public.sessoes s
        where s.id = anotacoes.sessao_id
          and s.terapeuta_id = auth.uid()
      )
      or exists (
        select 1
        from public.sessoes s
        where s.id = anotacoes.sessao_id
          and s.paciente_id = auth.uid()
      )
    )
  );

-- Política: Usuários podem atualizar apenas suas próprias anotações
create policy "Users can update own annotations"
  on public.anotacoes
  for update
  using (autor_id = auth.uid());

-- Política: Usuários podem deletar apenas suas próprias anotações
create policy "Users can delete own annotations"
  on public.anotacoes
  for delete
  using (autor_id = auth.uid());
