import type { Metadata } from 'next'
import { ButtonLink } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Sonar | Plataforma para Sessões de Psicoterapia',
  description: 'Grave, armazene e explore sessões de psicoterapia. Transforme a fala efêmera em um território explorável.',
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-24 text-center md:py-32 lg:py-40">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transforme suas sessões em{' '}
            <span className="text-primary">território explorável</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
            O Sonar permite gravar, armazenar e explorar sessões de psicoterapia.
            Transforme a fala efêmera da sessão em um dispositivo de amplificação subjetiva.
          </p>
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/cadastro" size="lg" className="text-base">
            Começar agora
          </ButtonLink>
          <ButtonLink href="/login" size="lg" variant="outline" className="text-base">
            Entrar
          </ButtonLink>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Recursos principais
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Gravação de áudio</h3>
              <p className="text-muted-foreground">
                Grave sessões diretamente no navegador ou faça upload de arquivos de áudio.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Anotações privadas</h3>
              <p className="text-muted-foreground">
                Terapeutas e pacientes podem adicionar anotações separadas e privadas para cada sessão.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Linha do tempo</h3>
              <p className="text-muted-foreground">
                Visualize todas as sessões em ordem cronológica com acesso fácil ao histórico completo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl rounded-lg border bg-card p-8 text-center md:p-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
            Pronto para começar?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Cadastre-se como terapeuta e comece a transformar suas sessões hoje mesmo.
          </p>
          <ButtonLink href="/cadastro" size="lg" className="text-base">
            Criar conta
          </ButtonLink>
        </div>
      </section>
    </div>
  )
}
