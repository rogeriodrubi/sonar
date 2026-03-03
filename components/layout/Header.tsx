import Link from 'next/link'
import { ButtonLink } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Sonar</span>
        </Link>
        
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/cadastro"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cadastro
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Login
          </Link>
          <ButtonLink href="/login" variant="default">
            Entrar
          </ButtonLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
