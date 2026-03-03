-- Migration: Criar bucket de storage para áudios
-- Descrição: Cria bucket 'audios' e configura policies de acesso baseadas em sessões

-- ============================================================================
-- CRIAR BUCKET
-- ============================================================================

-- Criar bucket 'audios' se não existir
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audios',
  'audios',
  false, -- bucket privado (não público)
  209715200, -- 200MB em bytes
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/mp3', 'audio/x-m4a']
)
on conflict (id) do nothing;

-- ============================================================================
-- POLICIES DE STORAGE
-- ============================================================================

-- Função auxiliar para extrair sessao_id do path
-- Path format: {terapeuta_id}/{paciente_id}/{sessao_id}.{ext}
create or replace function extract_sessao_id_from_path(path text)
returns uuid as $$
declare
  parts text[];
  sessao_part text;
begin
  -- Dividir o path por '/'
  parts := string_to_array(path, '/');
  
  -- O último elemento contém {sessao_id}.{ext}
  if array_length(parts, 1) >= 3 then
    sessao_part := parts[3];
    -- Remover extensão (tudo após o último ponto)
    sessao_part := split_part(sessao_part, '.', 1);
    -- Tentar converter para UUID
    return sessao_part::uuid;
  end if;
  
  return null;
end;
$$ language plpgsql immutable;

-- Política: Terapeutas podem ler arquivos de sessões onde são terapeutas
create policy "Therapists can read audio files from their sessions"
  on storage.objects
  for select
  using (
    bucket_id = 'audios'
    and exists (
      select 1
      from public.sessoes s
      where s.id = extract_sessao_id_from_path(name)
        and s.terapeuta_id = auth.uid()
    )
  );

-- Política: Pacientes podem ler arquivos de sessões onde são pacientes
create policy "Patients can read audio files from their sessions"
  on storage.objects
  for select
  using (
    bucket_id = 'audios'
    and exists (
      select 1
      from public.sessoes s
      where s.id = extract_sessao_id_from_path(name)
        and s.paciente_id = auth.uid()
    )
  );

-- Política: Terapeutas podem fazer upload de arquivos para sessões onde são terapeutas
create policy "Therapists can upload audio files to their sessions"
  on storage.objects
  for insert
  with check (
    bucket_id = 'audios'
    and exists (
      select 1
      from public.sessoes s
      where s.id = extract_sessao_id_from_path(name)
        and s.terapeuta_id = auth.uid()
    )
  );

-- Política: Pacientes podem fazer upload de arquivos para sessões onde são pacientes
create policy "Patients can upload audio files to their sessions"
  on storage.objects
  for insert
  with check (
    bucket_id = 'audios'
    and exists (
      select 1
      from public.sessoes s
      where s.id = extract_sessao_id_from_path(name)
        and s.paciente_id = auth.uid()
    )
  );

-- Política: Terapeutas podem atualizar arquivos de sessões onde são terapeutas
create policy "Therapists can update audio files from their sessions"
  on storage.objects
  for update
  using (
    bucket_id = 'audios'
    and exists (
      select 1
      from public.sessoes s
      where s.id = extract_sessao_id_from_path(name)
        and s.terapeuta_id = auth.uid()
    )
  );

-- Política: Terapeutas podem deletar arquivos de sessões onde são terapeutas
create policy "Therapists can delete audio files from their sessions"
  on storage.objects
  for delete
  using (
    bucket_id = 'audios'
    and exists (
      select 1
      from public.sessoes s
      where s.id = extract_sessao_id_from_path(name)
        and s.terapeuta_id = auth.uid()
    )
  );

-- Comentários
comment on function extract_sessao_id_from_path is 'Extrai o sessao_id do path do arquivo no formato {terapeuta_id}/{paciente_id}/{sessao_id}.{ext}';
