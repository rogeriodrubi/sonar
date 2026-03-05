import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile, Sessao } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pacientes | Sonar',
  description: 'Gerencie seus pacientes e acompanhe suas sessões',
}

interface PacienteComUltimaSessao {
  id: string
  nome: string | null
  created_at: string
  ultima_sessao: Sessao | null
}

export default async function PacientesPage() {
  const supabase = await createServerClient()
  
  // Verificar autenticação
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const terapeutaId = session.user.id

  // Buscar relações terapeuta-paciente
  const { data: relacoes, error: relacoesError } = await supabase
    .from('terapeutas_pacientes')
    .select('paciente_id, created_at')
    .eq('terapeuta_id', terapeutaId)
    .eq('ativo', true)
    .order('created_at', { ascending: false })

  if (relacoesError) {
    throw new Error(`Erro ao buscar pacientes: ${relacoesError.message}`)
  }

  if (!relacoes || relacoes.length === 0) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <Link
            href="/sessoes/nova"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Adicionar Paciente
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            Nenhum paciente cadastrado ainda
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione seu primeiro paciente para começar a registrar sessões.
          </p>
        </div>
      </div>
    )
  }

  // Buscar perfis dos pacientes
  const pacienteIds = relacoes.map((r) => r.paciente_id)
  const { data: perfis, error: perfisError } = await supabase
    .from('profiles')
    .select('id, nome, created_at')
    .in('id', pacienteIds)

  if (perfisError) {
    throw new Error(`Erro ao buscar perfis: ${perfisError.message}`)
  }

  // Criar mapa de perfis por ID
  const perfisMap = new Map<string, Profile>()
  if (perfis) {
    for (const perfil of perfis) {
      perfisMap.set(perfil.id, perfil)
    }
  }

  // Buscar todas as sessões dos pacientes de uma vez
  
  const { data: todasSessoes, error: sessoesError } = await supabase
    .from('sessoes')
    .select('id, paciente_id, data_sessao, duracao_minutos')
    .eq('terapeuta_id', terapeutaId)
    .in('paciente_id', pacienteIds)
    .order('data_sessao', { ascending: false })

  if (sessoesError) {
    console.error('Erro ao buscar sessões:', sessoesError)
  }

  // Agrupar sessões por paciente e pegar a mais recente de cada um
  const ultimasSessoesPorPaciente = new Map<string, Sessao>()
  if (todasSessoes) {
    for (const sessao of todasSessoes) {
      if (!ultimasSessoesPorPaciente.has(sessao.paciente_id)) {
        ultimasSessoesPorPaciente.set(sessao.paciente_id, sessao)
      }
    }
  }

  // Montar lista de pacientes com última sessão
  const pacientesComUltimaSessao: PacienteComUltimaSessao[] = relacoes
    .map((relacao) => {
      const paciente = perfisMap.get(relacao.paciente_id)
      if (!paciente) return null

      return {
        id: paciente.id,
        nome: paciente.nome,
        created_at: relacao.created_at,
        ultima_sessao: ultimasSessoesPorPaciente.get(paciente.id) || null,
      }
    })
    .filter((p): p is PacienteComUltimaSessao => p !== null)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <Link
          href="/sessoes/nova"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Adicionar Paciente
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pacientesComUltimaSessao.map((paciente) => (
          <Link
            key={paciente.id}
            href={`/pacientes/${paciente.id}`}
            className="group rounded-lg border p-6 transition-colors hover:bg-accent"
          >
            <h2 className="text-xl font-semibold group-hover:underline">
              {paciente.nome || 'Sem nome'}
            </h2>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Data de início:</span>{' '}
                {new Date(paciente.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
              {paciente.ultima_sessao ? (
                <div>
                  <span className="font-medium">Última sessão:</span>{' '}
                  {new Date(paciente.ultima_sessao.data_sessao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground">Nenhuma sessão registrada</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
