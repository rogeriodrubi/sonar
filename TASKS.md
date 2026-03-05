# Sonar — Tasks

## 📊 Status Atual

**Setup completo:** ✅ Projeto Next.js configurado, Supabase integrado, estrutura de pastas criada, migrations aplicadas, autenticação básica funcionando.

**Frontend básico:** ✅ Landing page, cadastro e login funcionais. Layout do dashboard com sidebar básico.

**Próxima fase:** Implementar funcionalidades core do produto — gestão de pacientes, sessões e anotações.

---

## 🚧 Em andamento
_(vazio — definir próxima tarefa)_

---

## 📋 Próximos Passos (prioridade top → bottom)

### 🔴 Prioridade Alta — MVP Core

#### 1. Gestão de Pacientes (Terapeuta)
- [ ] **Lista de Pacientes** (`/pacientes`)
  - [ ] Buscar pacientes do terapeuta do banco (query `terapeutas_pacientes` + `profiles`)
  - [ ] Exibir lista com nome, data de início e última sessão
  - [ ] Adicionar loading state e empty state
  - [ ] Link para página individual do paciente
- [ ] **Adicionar Paciente**
  - [ ] Formulário para adicionar paciente por e-mail
  - [ ] Route Handler `/api/pacientes` (POST) para criar relação
  - [ ] Validação: e-mail válido, paciente não existe ainda
  - [ ] Feedback de sucesso/erro
- [ ] **Página do Paciente** (`/pacientes/[id]`)
  - [ ] Buscar dados do paciente e sessões relacionadas
  - [ ] Exibir informações do paciente (nome, data de início)
  - [ ] Integrar componente `LinhaDoTempo` com dados reais
  - [ ] Link para criar nova sessão com paciente pré-selecionado

#### 2. Sessões — Criação e Upload
- [ ] **Formulário Nova Sessão** (`/sessoes/nova`)
  - [ ] Campos: paciente (select), data, duração (opcional)
  - [ ] Opções: upload de arquivo OU gravação direta
  - [ ] Validação de campos obrigatórios
  - [ ] Route Handler `/api/sessoes` (POST) para criar sessão
- [ ] **Upload de Áudio**
  - [ ] Componente de upload de arquivo (input file)
  - [ ] Validação: tipo (mp3, m4a, wav), tamanho máximo (200MB)
  - [ ] Route Handler `/api/upload` funcional
  - [ ] Upload para Supabase Storage bucket `audios`
  - [ ] Salvar `audio_url` na sessão criada
  - [ ] Feedback de progresso durante upload
- [ ] **Gravação de Áudio** (`GravadorAudio.tsx`)
  - [ ] Implementar MediaRecorder API
  - [ ] Controles: iniciar, pausar, parar
  - [ ] Exibir tempo de gravação
  - [ ] Converter blob para arquivo e fazer upload
  - [ ] Tratamento de erros (permissão de microfone negada)

#### 3. Visualização de Sessão
- [ ] **Página da Sessão** (`/pacientes/[id]/sessoes/[sessaoId]`)
  - [ ] Buscar dados da sessão do banco
  - [ ] Exibir informações: data, duração, paciente
  - [ ] Integrar `AudioPlayer` funcional
  - [ ] Seção para transcrição (exibir se existir)
  - [ ] Seção para anotações (terapeuta e paciente separadas)
- [ ] **Player de Áudio** (`AudioPlayer.tsx`)
  - [ ] Usar HTML5 `<audio>` element
  - [ ] Controles: play/pause, barra de progresso, tempo decorrido/total
  - [ ] Buscar signed URL do Supabase Storage
  - [ ] Tratamento de erros (arquivo não encontrado, formato inválido)

#### 4. Linha do Tempo
- [ ] **Linha do Tempo Funcional** (`LinhaDoTempo.tsx`)
  - [ ] Receber array de sessões via props
  - [ ] Ordenar por data (mais recente primeiro)
  - [ ] Exibir cards com: data formatada, duração, indicador de anotação
  - [ ] Link para página individual de cada sessão
  - [ ] Empty state quando não há sessões

### 🟡 Prioridade Média — Funcionalidades Essenciais

#### 5. Anotações com Tiptap
- [ ] **Instalar Tiptap**
  - [ ] `npm install @tiptap/react @tiptap/starter-kit`
  - [ ] Configurar extensões básicas (negrito, itálico, listas)
- [ ] **Editor de Anotações** (`AnotacaoEditor.tsx`)
  - [ ] Implementar editor Tiptap funcional
  - [ ] Toolbar com formatação básica
  - [ ] Salvar conteúdo como JSON (`editor.getJSON()`)
  - [ ] Route Handler `/api/anotacoes` (POST/PUT) para salvar
  - [ ] Buscar anotação existente ao carregar
- [ ] **Autosave**
  - [ ] Debounce de 1500ms no `onUpdate` do editor
  - [ ] Indicador visual de salvamento (salvando/salvo)
  - [ ] Tratamento de erros de salvamento
- [ ] **Isolamento de Anotações**
  - [ ] Garantir que query de anotações filtra por `autor_id = auth.uid()`
  - [ ] Terapeuta só vê suas anotações, paciente só vê as dele
  - [ ] Testar RLS no banco de dados

#### 6. Fluxo de Convite de Paciente
- [ ] **Gerar Token de Convite**
  - [ ] Route Handler `/api/pacientes/[id]/convite` (POST)
  - [ ] Gerar token único (UUID ou JWT)
  - [ ] Salvar token em tabela `convites` ou usar campo em `terapeutas_pacientes`
  - [ ] Enviar e-mail com link de convite (usar Supabase Edge Function ou serviço externo)
- [ ] **Página de Convite** (`/convite/[token]`)
  - [ ] Validar token (verificar se válido e não expirado)
  - [ ] Formulário para paciente criar senha
  - [ ] Criar conta de paciente vinculada ao terapeuta
  - [ ] Redirecionar para dashboard do paciente após cadastro

#### 7. Dashboard do Paciente
- [ ] **Layout do Paciente**
  - [ ] Criar `app/(paciente)/layout.tsx`
  - [ ] Verificar se usuário é paciente (não terapeuta)
  - [ ] Sidebar simplificada (sem acesso a gestão de pacientes)
- [ ] **Página Inicial do Paciente**
  - [ ] Exibir linha do tempo das próprias sessões
  - [ ] Acesso apenas às sessões onde `paciente_id = auth.uid()`

### 🟢 Prioridade Baixa — Melhorias e Polimento

#### 8. Transcrição Manual
- [ ] Campo de texto longo na página da sessão
- [ ] Salvar/editar transcrição via Route Handler
- [ ] Exibir transcrição ao lado do player de áudio

#### 9. Melhorias de UX
- [ ] Loading skeletons em todas as páginas
- [ ] Error boundaries para tratamento de erros
- [ ] Toast notifications para feedback de ações
- [ ] Melhorar sidebar do dashboard (ícones, estados ativos)
- [ ] Breadcrumbs nas páginas profundas

#### 10. Arquivar Paciente
- [ ] Botão para arquivar paciente (sem deletar dados)
- [ ] Filtro na lista de pacientes (ativos/arquivados)
- [ ] Route Handler para atualizar `ativo = false`

---

## ✅ Concluído

### Setup e Infraestrutura
- ✅ Projeto Next.js criado com TypeScript strict
- ✅ Supabase instalado e configurado (client.ts, server.ts, middleware.ts)
- ✅ Estrutura de pastas criada conforme ARCHITECTURE.md
- ✅ shadcn/ui instalado e configurado
- ✅ Middleware de autenticação implementado
- ✅ Tipos globais criados em `types/index.ts`

### Banco de Dados
- ✅ Migrations criadas: `profiles`, `terapeutas_pacientes`, `sessoes`, `anotacoes`
- ✅ Row Level Security configurado em todas as tabelas
- ✅ Bucket `audios` criado no Supabase Storage com policies

### Frontend Básico
- ✅ Landing page completa com hero, features e CTA
- ✅ Layout público com Header e Footer
- ✅ Página de cadastro funcional (`/cadastro`)
- ✅ Página de login funcional (`/login`)
- ✅ Layout do dashboard com sidebar básico
- ✅ Componentes placeholder criados (AudioPlayer, GravadorAudio, AnotacaoEditor, LinhaDoTempo)
- ✅ Route handlers placeholder criados (`/api/upload`, `/api/sessoes`, `/api/auth/cadastro`)

---

## 📝 Notas de Implementação

### Padrões a Seguir
- Sempre usar Server Components para buscar dados do Supabase
- Client Components apenas quando necessário (interatividade, hooks)
- Sempre tratar erros explicitamente (checar `error` antes de usar `data`)
- Nunca expor `service_role` key no cliente
- Tipos sempre de `types/index.ts`, sem `any`
- Upload de áudio: usar signed URLs (não public URLs)

### Dependências Pendentes
- `@tiptap/react` e `@tiptap/starter-kit` (para anotações)
- Possivelmente `react-dropzone` (para upload de arquivos)
- Possivelmente `date-fns` (para formatação de datas)
