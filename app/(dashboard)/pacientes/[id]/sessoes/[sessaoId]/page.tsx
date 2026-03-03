interface Props {
  params: Promise<{ id: string; sessaoId: string }>
}

export default async function SessaoPage({ params }: Props) {
  const { id, sessaoId } = await params
  
  return (
    <div>
      <h1 className="text-3xl font-bold">Sessão</h1>
      <p className="mt-4 text-muted-foreground">Paciente ID: {id}</p>
      <p className="text-muted-foreground">Sessão ID: {sessaoId}</p>
      <p className="text-muted-foreground">Página de sessão em desenvolvimento</p>
    </div>
  )
}
