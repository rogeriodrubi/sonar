import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Sonar</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma para gravar, armazenar e explorar sessões de psicoterapia.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Links</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/cadastro" className="text-muted-foreground hover:text-foreground">
                  Cadastro
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Sobre</h4>
            <p className="text-sm text-muted-foreground">
              Transformando a fala efêmera da sessão em um território explorável.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sonar. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
