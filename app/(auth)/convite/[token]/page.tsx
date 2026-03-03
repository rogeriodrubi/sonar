interface Props {
  params: Promise<{ token: string }>
}

export default async function ConvitePage({ params }: Props) {
  const { token } = await params
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold">Convite</h1>
        <p className="text-muted-foreground">Token: {token}</p>
        <p className="text-muted-foreground">Página de convite em desenvolvimento</p>
      </div>
    </div>
  )
}
