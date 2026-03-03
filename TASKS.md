# Sonar — Tasks

## 🚧 Em andamento
_(vazio — setup concluído)_

---

## 📋 Backlog (prioridade top → bottom)

### Setup
- [x] Criar projeto Next.js com TypeScript strict (`npx create-next-app@latest`)
- [x] Instalar e configurar Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Configurar variáveis de ambiente (`.env.local`)
- [x] Criar estrutura de pastas conforme `ARCHITECTURE.md`
- [x] Instalar shadcn/ui e configurar tema

### Landing Page e Layout Público
- [x] Criar layout público (`app/(public)/layout.tsx`) com header e footer
- [x] Criar página inicial (`app/(public)/page.tsx`) com hero section
- [x] Implementar seção de features/benefícios
- [ ] Criar página de cadastro (`app/(public)/cadastro/page.tsx`)
- [x] Adicionar call-to-action para terapeutas
- [x] Garantir responsividade mobile-first
- [x] Adicionar metadata e SEO básico

### Banco de Dados
- [x] Criar migration: tabela `profiles`
- [x] Criar migration: tabela `terapeutas_pacientes`
- [x] Criar migration: tabela `sessoes`
- [x] Criar migration: tabela `anotacoes`
- [x] Configurar Row Level Security em todas as tabelas
- [x] Criar bucket `audios` no Supabase Storage com policies

### Autenticação
- [x] Implementar `lib/supabase/client.ts` e `server.ts`
- [x] Implementar middleware de auth (`middleware.ts`)
- [x] Criar página `/login` (placeholder)
- [ ] Criar fluxo de convite de paciente via e-mail
- [x] Criar página `/convite/[token]` (placeholder)

### Dashboard do Terapeuta
- [x] Criar layout do dashboard com sidebar
- [x] Criar página `/pacientes` (placeholder)
- [x] Criar página `/pacientes/[id]` (placeholder)
- [x] Criar página `/sessoes/nova` (placeholder)

### Sessões
- [x] Criar Route Handler `/api/upload` (placeholder)
- [x] Criar componente `GravadorAudio.tsx` (placeholder)
- [x] Criar componente `AudioPlayer.tsx` (placeholder)
- [ ] Implementar upload de áudio (componente + Route Handler)
- [ ] Implementar gravação direta no browser
- [ ] Implementar player de áudio funcional
- [ ] Implementar upload de transcrição manual

### Anotações
- [ ] Instalar e configurar Tiptap
- [x] Criar `AnotacaoEditor.tsx` (placeholder)
- [ ] Implementar autosave
- [ ] Garantir isolamento: anotação do terapeuta invisível ao paciente e vice-versa

### Visão do Paciente
- [ ] Criar layout separado para paciente (sem acesso a funcionalidades de terapeuta)
- [x] Criar componente `LinhaDoTempo.tsx` (placeholder)

---

## ✅ Concluído

### Setup
- ✅ Projeto Next.js criado com TypeScript strict
- ✅ Supabase instalado e configurado (client.ts, server.ts, middleware.ts)
- ✅ Estrutura de pastas criada conforme ARCHITECTURE.md
- ✅ shadcn/ui instalado e configurado
- ✅ Middleware de autenticação implementado
- ✅ Tipos globais criados em `types/index.ts`
- ✅ Componentes placeholder criados
