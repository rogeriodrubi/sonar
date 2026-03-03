-- Migration: Adicionar política RLS para INSERT em profiles
-- Descrição: Permite que usuários criem seu próprio perfil após signup

-- Política: Usuários podem criar seu próprio perfil
create policy "Users can create own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);
