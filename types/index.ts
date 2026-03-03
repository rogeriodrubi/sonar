export interface Profile {
  id: string
  nome: string | null
  tipo: 'terapeuta' | 'paciente'
  avatar_url: string | null
  created_at: string
}

export interface TerapeutaPaciente {
  id: string
  terapeuta_id: string
  paciente_id: string
  ativo: boolean
  created_at: string
}

export interface Sessao {
  id: string
  terapeuta_id: string
  paciente_id: string
  data_sessao: string
  duracao_minutos: number | null
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
