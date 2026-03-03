# Guia de Configuração do Supabase — Sonar

Este guia explica passo a passo como configurar o Supabase para o projeto Sonar.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (gratuita)
- Node.js e npm instalados
- Projeto Next.js já configurado (conforme `TASKS.md`)

---

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Preencha os dados:
   - **Name**: `sonar` (ou o nome que preferir)
   - **Database Password**: Escolha uma senha forte e **salve em local seguro**
   - **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
   - **Pricing Plan**: Free (suficiente para desenvolvimento)

4. Aguarde a criação do projeto (pode levar alguns minutos)

---

## 🔑 Passo 2: Obter Credenciais do Projeto

Após o projeto ser criado:

1. No dashboard do Supabase, vá em **Settings** → **API**
2. Você verá duas informações importantes:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon/public key**: Uma chave longa começando com `eyJ...`

3. **Copie essas duas informações** — você precisará delas no próximo passo

---

## 📝 Passo 3: Configurar Variáveis de Ambiente

1. No diretório raiz do projeto, crie um arquivo `.env.local`:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

2. Adicione as seguintes variáveis (substitua pelos valores do seu projeto):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE**: 
- Use a chave **anon/public**, NUNCA a `service_role` key
- O arquivo `.env.local` já está no `.gitignore` e não será commitado

---

## 🗄️ Passo 4: Executar Migrations (Criar Tabelas)

O projeto já possui todas as migrations SQL prontas na pasta `supabase/migrations/`. Você precisa executá-las no Supabase.

### Opção A: Via SQL Editor (Recomendado para começar)

1. No dashboard do Supabase, vá em **SQL Editor**
2. Abra cada arquivo de migration na ordem numérica:
   - `20240101000000_create_profiles.sql`
   - `20240101000001_create_terapeutas_pacientes.sql`
   - `20240101000002_create_sessoes.sql`
   - `20240101000003_create_anotacoes.sql`
   - `20240101000004_enable_rls.sql`
   - `20240101000005_create_storage_bucket_audios.sql`
   - `20240101000006_add_profile_insert_policy.sql`

3. Para cada arquivo:
   - Copie o conteúdo completo
   - Cole no SQL Editor
   - Clique em **Run** (ou pressione `Ctrl+Enter`)
   - Verifique se apareceu "Success. No rows returned"

### Opção B: Via Supabase CLI (Avançado)

Se você tem o Supabase CLI instalado:

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Fazer login
supabase login

# Linkar projeto local ao remoto
supabase link --project-ref seu-project-ref

# Executar migrations
supabase db push
```

**Nota**: O `project-ref` está na URL do projeto: `https://xxxxx.supabase.co` → `xxxxx` é o project-ref.

---

## ✅ Passo 5: Verificar se Tudo Foi Criado

Após executar as migrations, verifique:

### Tabelas Criadas

Vá em **Table Editor** e confirme que existem estas tabelas:
- ✅ `profiles`
- ✅ `terapeutas_pacientes`
- ✅ `sessoes`
- ✅ `anotacoes`

### Storage Bucket

Vá em **Storage** e confirme que existe:
- ✅ Bucket `audios` (privado, limite de 200MB)

### Row Level Security (RLS)

Vá em **Authentication** → **Policies** e confirme que todas as tabelas têm RLS habilitado com políticas configuradas.

---

## 🔐 Passo 6: Configurar Autenticação (Opcional)

Por padrão, o Supabase já vem com autenticação por e-mail/senha habilitada. Você pode configurar:

1. **Email Templates**: Settings → Authentication → Email Templates
   - Personalize os templates de confirmação de e-mail, reset de senha, etc.

2. **Auth Providers**: Settings → Authentication → Providers
   - Por padrão, Email está habilitado
   - Você pode adicionar Google, GitHub, etc. se necessário

3. **Site URL**: Settings → Authentication → URL Configuration
   - Configure `http://localhost:3000` para desenvolvimento
   - Configure seu domínio de produção quando fizer deploy

---

## 🧪 Passo 7: Testar a Configuração

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Acesse `http://localhost:3000`

3. Tente criar uma conta (se a página de cadastro estiver implementada)

4. Verifique no Supabase:
   - **Authentication** → **Users**: deve aparecer o usuário criado
   - **Table Editor** → **profiles**: deve aparecer um registro vinculado ao usuário

---

## 📚 Estrutura do Banco de Dados

### Tabelas Principais

- **`profiles`**: Perfis de usuários (terapeutas e pacientes)
- **`terapeutas_pacientes`**: Relação entre terapeutas e seus pacientes
- **`sessoes`**: Sessões de terapia com referência ao áudio
- **`anotacoes`**: Anotações separadas (terapeuta vs paciente)

### Segurança

- **Row Level Security (RLS)** está habilitado em todas as tabelas
- Terapeutas só veem seus próprios dados e de seus pacientes
- Pacientes só veem seus próprios dados e sessões vinculadas
- Anotações são completamente isoladas (terapeuta não vê do paciente e vice-versa)

### Storage

- Bucket `audios` para armazenar arquivos de áudio
- Limite de 200MB por arquivo
- Formatos aceitos: MP3, M4A, WAV
- Políticas de acesso baseadas em `sessao_id`

---

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- **Causa**: Migrations não foram executadas
- **Solução**: Execute todas as migrations na ordem correta

### Erro: "new row violates row-level security policy"
- **Causa**: RLS está bloqueando a operação
- **Solução**: Verifique se o usuário está autenticado e se as políticas estão corretas

### Erro: "bucket does not exist"
- **Causa**: Migration do storage não foi executada
- **Solução**: Execute `20240101000005_create_storage_bucket_audios.sql`

### Variáveis de ambiente não funcionam
- **Causa**: Arquivo `.env.local` não está na raiz ou servidor não foi reiniciado
- **Solução**: 
  - Verifique se o arquivo está em `E:\Rogerio Original\Projetos\sonar\.env.local`
  - Reinicie o servidor (`npm run dev`)

---

## 📖 Próximos Passos

Após configurar o Supabase:

1. ✅ Testar criação de usuário
2. ✅ Implementar fluxo de convite de paciente
3. ✅ Implementar upload de áudio
4. ✅ Implementar player de áudio

Consulte `TASKS.md` para ver todas as tarefas pendentes.

---

## 🔗 Links Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
