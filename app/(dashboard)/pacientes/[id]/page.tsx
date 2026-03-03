interface Props {
  params: Promise<{ id: string }>
}

export default async function PacientePage({ params }: Props) {
  const { id } = await params
  
  return (
    <div>
      <h1 className="text-3xl font-bold">Linha do Tempo do Paciente</h1>
      <p className="mt-4 text-muted-foreground">ID: {id}</p>
      <p className="text-muted-foreground">Linha do tempo em desenvolvimento</p>
    </div>
  )
}
