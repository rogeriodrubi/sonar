# Sonar — Skills (Padrões de Implementação)

## 🔐 Autenticação com Supabase

Sempre use o client correto para o contexto:

```typescript
// Server Component ou Route Handler
import { createServerClient } from '@/lib/supabase/server'
const supabase = createServerClient()
const { data: { session } } = await supabase.auth.getSession()

// Client Component
import { createBrowserClient } from '@/lib/supabase/client'
const supabase = createBrowserClient()
```

Redirecionamento para `/login` se não autenticado deve acontecer no middleware (`lib/supabase/middleware.ts`), não nos componentes.

---

## 🗄️ Queries ao Banco

- Sempre usar o Supabase SDK (nunca SQL raw, exceto em migrations)
- Sempre tipar o retorno com os tipos de `types/index.ts`
- Sempre tratar erros explicitamente

```typescript
const { data: sessoes, error } = await supabase
  .from('sessoes')
  .select('id, data_sessao, duracao_minutos, audio_url')
  .eq('paciente_id', pacienteId)
  .order('data_sessao', { ascending: false })

if (error) throw new Error(`Erro ao buscar sessões: ${error.message}`)
```

---

## 📁 Upload de Arquivos (Áudio)

- Bucket: `audios`
- Path: `{terapeuta_id}/{paciente_id}/{sessao_id}.{ext}`
- Tamanho máximo: 200MB
- Tipos aceitos: `audio/mpeg`, `audio/mp4`, `audio/wav`

```typescript
const { data, error } = await supabase.storage
  .from('audios')
  .upload(filePath, file, { upsert: false })

if (error) throw new Error(`Upload falhou: ${error.message}`)

// Usar signed URL (nunca public URL) — sessões são dados sensíveis
const { data: signedUrlData, error: urlError } = await supabase.storage
  .from('audios')
  .createSignedUrl(filePath, 60 * 60) // expira em 1 hora

if (urlError) throw new Error(`Erro ao gerar URL: ${urlError.message}`)
const audioUrl = signedUrlData.signedUrl
```

---

## 🧩 Criação de Componentes

- Sempre `'use client'` explícito no topo quando necessário
- Nomear arquivos em PascalCase: `AudioPlayer.tsx`
- Exportar como named export + default
- Interface `Props` sempre acima do componente

```typescript
'use client'

interface Props {
  audioUrl: string
  duracaoMinutos: number
}

export function AudioPlayer({ audioUrl, duracaoMinutos }: Props) {
  // ...
}

export default AudioPlayer
```

---

## ✍️ Anotações (Tiptap)

- Sempre autosave com debounce de 1500ms via `onUpdate`
- Conteúdo salvo como JSON (`editor.getJSON()`)
- Nunca salvar HTML — sempre JSON para portabilidade

```typescript
const editor = useEditor({
  extensions: [StarterKit],
  content: anotacaoInicial,
  onUpdate: debounce(({ editor }) => {
    salvarAnotacao(editor.getJSON())
  }, 1500),
})
```

---

## 🛡️ Tipos Globais

Sempre tipar entidades do banco em `types/index.ts` e usar em toda a aplicação:

```typescript
export interface Sessao {
  id: string
  terapeuta_id: string
  paciente_id: string
  data_sessao: string
  duracao_minutos: number
  audio_url: string | null
  transcricao: string | null
  created_at: string
}

export interface Anotacao {
  id: string
  sessao_id: string
  autor_id: string
  conteudo: Record<string, unknown> // JSON do Tiptap
  updated_at: string
}
```

---

## 🎨 Estilização

- Usar Tailwind CSS + shadcn/ui como base
- Paleta principal: tons de azul-escuro e off-white (remete ao conceito de "sonar")
- Nunca usar estilos inline — sempre classes Tailwind
- Componentes shadcn customizados ficam em `components/ui/`
