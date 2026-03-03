'use client'

import type { Sessao } from '@/types'

interface Props {
  sessoes: Sessao[]
}

export function LinhaDoTempo({ sessoes }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Linha do Tempo</h2>
      <p className="mt-4 text-muted-foreground">
        {sessoes.length} sessão(ões) encontrada(s)
      </p>
    </div>
  )
}

export default LinhaDoTempo
