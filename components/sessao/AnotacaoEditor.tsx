'use client'

interface Props {
  sessaoId: string
  autorId: string
  conteudoInicial?: Record<string, unknown>
}

export function AnotacaoEditor({ sessaoId, autorId, conteudoInicial }: Props) {
  return (
    <div>
      <p>AnotacaoEditor em desenvolvimento</p>
      <p>Sessão ID: {sessaoId}</p>
      <p>Autor ID: {autorId}</p>
    </div>
  )
}

export default AnotacaoEditor
