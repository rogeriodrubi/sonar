# Sonar — Product Requirements Document (v1)

## Visão do Produto
Permitir que terapeutas e pacientes registrem, acessem e reflitam sobre o conteúdo das sessões terapêuticas de forma segura, organizada e significativa.

---

## Funcionalidades

### [MUST] Autenticação e Perfis
- Terapeuta se cadastra com e-mail e senha (via Supabase Auth)
- Paciente é convidado por e-mail pelo terapeuta
- Cada usuário tem perfil com nome, foto e tipo (terapeuta | paciente)
- Critérios de aceite:
  - Terapeuta consegue criar conta e acessar o dashboard
  - Paciente recebe convite, cria senha e acessa apenas suas sessões
  - Logout funcional em todas as telas

### [MUST] Gestão de Pacientes (visão do Terapeuta)
- Terapeuta pode adicionar pacientes via e-mail
- Terapeuta vê lista de todos os seus pacientes
- Terapeuta pode arquivar um paciente (sem deletar dados)
- Critérios de aceite:
  - Lista de pacientes exibe nome, data de início e última sessão
  - Paciente arquivado não aparece na lista principal mas dados são preservados

### [MUST] Sessões
- Terapeuta pode criar uma sessão com data, duração e paciente vinculado
- Sessão aceita: upload de áudio (mp3, m4a, wav) ou upload de transcrição (txt, pdf)
- Sessão pode ser gravada diretamente no browser (MediaRecorder API)
- Critérios de aceite:
  - Upload de arquivo até 200MB
  - Gravação direta com botão de iniciar/pausar/encerrar
  - Sessão salva aparece na linha do tempo do paciente
  - Player de áudio funcional na página da sessão

### [MUST] Anotações Separadas
- Terapeuta pode adicionar anotações clínicas em uma sessão (visíveis apenas para ele)
- Paciente pode adicionar reflexões em uma sessão (visíveis apenas para ele)
- Critérios de aceite:
  - Anotação do terapeuta nunca é exibida para o paciente, e vice-versa
  - Anotações suportam texto rico (negrito, itálico, listas)
  - Anotações são salvas automaticamente (autosave)

### [MUST] Linha do Tempo do Paciente
- Paciente e terapeuta visualizam as sessões em ordem cronológica
- Cada sessão exibe: data, duração e se há anotação adicionada
- Critérios de aceite:
  - Interface clara com datas e marcadores visuais
  - Sessões mais recentes aparecem no topo

### [SHOULD] Transcrição Manual
- Terapeuta ou paciente pode adicionar ou editar a transcrição textual de uma sessão
- Critérios de aceite:
  - Campo de texto longo vinculado à sessão
  - Transcrição exibida lado a lado com o player de áudio

### [COULD] Busca por conteúdo
- Busca textual dentro das transcrições de um paciente
- (Reservado para v2)

---

## Fora de Escopo (v1)
- IA para transcrição automática
- IA para identificação de padrões
- Assistente conversacional
- Videochamada integrada
- Pagamentos (billing pode ser externo inicialmente)
