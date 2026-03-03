# Sonar — Especificações de Front-End

## Visão Geral

Este documento estabelece padrões e convenções para desenvolvimento front-end no Sonar, garantindo consistência, manutenibilidade e facilitando o desenvolvimento colaborativo.

**Princípios Fundamentais:**
- TypeScript strict mode — sem `any`
- Server Components por padrão, Client Components apenas quando necessário
- Mobile-first e responsivo
- Acessibilidade (WCAG) como requisito, não opcional
- Performance otimizada desde o início

---

## 📁 Estrutura de Pastas

### Organização de Componentes

Componentes organizados por domínio de negócio:

```
components/
├── ui/                    # Componentes shadcn/ui base (reutilizáveis)
├── sessao/               # Componentes específicos de sessão
│   ├── AudioPlayer.tsx
│   ├── GravadorAudio.tsx
│   └── AnotacaoEditor.tsx
├── paciente/             # Componentes específicos de paciente
│   └── LinhaDoTempo.tsx
└── layout/               # Componentes de layout (Header, Footer, Sidebar)
    ├── Header.tsx
    ├── Footer.tsx
    └── Sidebar.tsx
```

**Regras:**
- Componentes específicos de domínio ficam em pastas nomeadas (`sessao/`, `paciente/`)
- Componentes reutilizáveis genéricos ficam em `components/ui/` (shadcn/ui)
- Componentes de layout compartilhado ficam em `components/layout/`
- Cada componente em arquivo próprio, PascalCase: `AudioPlayer.tsx`

### Route Groups no App Router

```
app/
├── (public)/             # Páginas públicas (landing, sobre, etc.)
│   ├── layout.tsx       # Layout público com header/footer
│   ├── page.tsx         # Landing page
│   └── cadastro/
│       └── page.tsx
├── (auth)/               # Páginas de autenticação
│   ├── layout.tsx       # Layout minimalista para auth
│   ├── login/
│   │   └── page.tsx
│   └── convite/[token]/
│       └── page.tsx
└── (dashboard)/          # Área autenticada
    ├── layout.tsx       # Layout com sidebar + auth guard
    ├── pacientes/
    │   └── page.tsx
    └── sessoes/
        └── nova/
            └── page.tsx
```

**Convenções:**
- Route groups `(nome)` não aparecem na URL
- Cada grupo tem seu próprio `layout.tsx` quando necessário
- Layouts aninhados herdam do layout pai

---

## ⚛️ Server vs Client Components

### Quando Usar Server Components (Padrão)

**Use Server Components para:**
- Buscar dados do Supabase
- Renderizar conteúdo estático ou pouco dinâmico
- Acessar cookies/headers (via `headers()`)
- Reduzir bundle size do cliente

```typescript
// ✅ Server Component (padrão)
import { createServerClient } from '@/lib/supabase/server'

export default async function PacientesPage() {
  const supabase = await createServerClient()
  const { data: pacientes } = await supabase
    .from('profiles')
    .select('*')
    .eq('tipo', 'paciente')

  return <ListaPacientes pacientes={pacientes} />
}
```

### Quando Usar Client Components

**Use Client Components (`'use client'`) para:**
- Interatividade (onClick, onChange, etc.)
- Hooks do React (useState, useEffect, useRouter)
- Event listeners do browser
- APIs do browser (MediaRecorder, localStorage, etc.)

```typescript
// ✅ Client Component (quando necessário)
'use client'

import { useState } from 'react'

interface Props {
  audioUrl: string
}

export function AudioPlayer({ audioUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  // ...
}
```

### Padrão de Composição

Compor Server Components com Client Components:

```typescript
// ✅ Server Component (wrapper)
export default async function SessaoPage({ params }: { params: { id: string } }) {
  const sessao = await buscarSessao(params.id)
  
  return (
    <div>
      <h1>Sessão {sessao.id}</h1>
      {/* Client Component como child */}
      <AudioPlayer audioUrl={sessao.audio_url} />
    </div>
  )
}
```

---

## 🎨 Layouts e Estrutura de Páginas

### Layout Público (`app/(public)/layout.tsx`)

```typescript
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

### Layout de Autenticação (`app/(auth)/layout.tsx`)

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
```

### Layout do Dashboard (`app/(dashboard)/layout.tsx`)

```typescript
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

### Metadata por Página

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pacientes | Sonar',
  description: 'Gerencie seus pacientes',
}

export default function PacientesPage() {
  // ...
}
```

**Padrão de títulos:** `{Página} | Sonar` (ex: `Pacientes | Sonar`, `Nova Sessão | Sonar`)

---

## 🧩 Componentes

### Estrutura Padrão

```typescript
'use client' // apenas se necessário

interface Props {
  audioUrl: string
  duracaoMinutos: number
  onPlay?: () => void
}

export function AudioPlayer({ audioUrl, duracaoMinutos, onPlay }: Props) {
  // implementação
}

export default AudioPlayer
```

**Regras:**
- Interface `Props` sempre acima do componente
- Named export (`export function`) + default export
- Props tipadas com TypeScript strict (sem `any`)
- Props opcionais marcadas com `?`
- `'use client'` explícito apenas quando necessário

### Componentes Reutilizáveis vs Específicos

**Reutilizáveis (`components/ui/`):**
- Componentes shadcn/ui base
- Componentes genéricos (Button, Input, Card, etc.)
- Não dependem de lógica de negócio

**Específicos (`components/sessao/`, `components/paciente/`):**
- Componentes que conhecem o domínio
- Podem usar tipos de `types/index.ts`
- Podem fazer queries (se Server Component) ou receber dados via props

### Composição com Children

```typescript
interface CardProps {
  title: string
  children: React.ReactNode
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}
```

---

## 🎨 Design System e Estilização

### Tailwind CSS

**Regras:**
- Sempre usar classes Tailwind, nunca estilos inline
- Usar variáveis CSS do tema (`bg-background`, `text-foreground`, etc.)
- Seguir mobile-first: classes base para mobile, breakpoints para desktop

```typescript
// ✅ Correto
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-8">

// ❌ Errado
<div style={{ display: 'flex', padding: '24px' }}>
```

### Componentes shadcn/ui

- Componentes base em `components/ui/`
- Customizar via `tailwind.config.ts` e variáveis CSS
- Não modificar diretamente componentes shadcn — criar variantes quando necessário

### Paleta de Cores

Cores definidas em `app/globals.css` via CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

**Uso:**
- `bg-background`, `text-foreground` para cores base
- `bg-primary`, `text-primary-foreground` para ações principais
- `bg-muted`, `text-muted-foreground` para elementos secundários
- `border-border` para bordas

### Tipografia

```typescript
// Títulos
<h1 className="text-4xl font-bold">Título Principal</h1>
<h2 className="text-2xl font-semibold">Subtítulo</h2>
<h3 className="text-xl font-medium">Seção</h3>

// Corpo
<p className="text-base">Texto padrão</p>
<p className="text-sm text-muted-foreground">Texto secundário</p>
```

### Espaçamento

Usar escala do Tailwind:
- `gap-2`, `gap-4`, `gap-6`, `gap-8` para espaçamento entre elementos
- `p-4`, `p-6`, `p-8` para padding interno
- `mb-4`, `mt-6` para espaçamento vertical específico

### Dark Mode

Dark mode suportado via `darkMode: ["class"]` no Tailwind. Variáveis CSS já incluem valores para `.dark`.

---

## 📝 Formulários e Validação

### Estrutura de Formulário

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FormularioCadastro() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // validação e submit
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" name="nome" required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
```

### Validação

- Validação no cliente: opcional, para melhor UX
- Validação no servidor: obrigatória (Route Handler ou Server Action)
- Sempre mostrar feedback visual de erros
- Desabilitar botão de submit durante loading

### Componentes shadcn/ui para Formulários

- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` (react-hook-form)
- `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`
- `Button` com variantes (`default`, `destructive`, `outline`, `ghost`)

---

## 🔄 Estados da UI

### Loading States

```typescript
// Skeleton para conteúdo carregando
import { Skeleton } from '@/components/ui/skeleton'

export function PacienteCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  )
}

// Spinner para ações
import { Loader2 } from 'lucide-react'

<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Salvar
</Button>
```

### Error States

```typescript
// Error boundary (criar componente)
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold text-destructive">Algo deu errado</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-4">
        Tentar novamente
      </Button>
    </div>
  )
}

// Mensagem de erro inline
{error && (
  <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
    {error}
  </div>
)}
```

### Empty States

```typescript
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
```

### Optimistic Updates

Para ações rápidas (ex: toggle, like), atualizar UI imediatamente e reverter se falhar:

```typescript
const [isArchived, setIsArchived] = useState(paciente.arquivado)

async function handleArchive() {
  const previousValue = isArchived
  setIsArchived(!previousValue) // optimístico

  try {
    await arquivarPaciente(paciente.id)
  } catch {
    setIsArchived(previousValue) // reverter se falhar
  }
}
```

---

## 🧭 Navegação e Roteamento

### Link do Next.js

```typescript
import Link from 'next/link'

// ✅ Sempre usar Link para navegação interna
<Link href="/pacientes" className="hover:underline">
  Pacientes
</Link>

// Para links externos, usar <a> com target="_blank" e rel
<a href="https://exemplo.com" target="_blank" rel="noopener noreferrer">
  Link externo
</a>
```

### Navegação Programática

```typescript
'use client'

import { useRouter } from 'next/navigation'

export function BotaoNavegar() {
  const router = useRouter()

  function handleClick() {
    router.push('/pacientes')
  }

  return <Button onClick={handleClick}>Ir para Pacientes</Button>
}
```

### Active States em Menus

```typescript
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'text-sm hover:underline',
        isActive && 'font-semibold text-primary'
      )}
    >
      {children}
    </Link>
  )
}
```

### Breadcrumbs

Para páginas profundas, usar breadcrumbs:

```typescript
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </span>
      ))}
    </nav>
  )
}
```

---

## ♿ Acessibilidade

### Semântica HTML

```typescript
// ✅ Usar elementos semânticos
<header>
  <nav>
    <ul>
      <li><Link href="/">Home</Link></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Título</h1>
    <p>Conteúdo</p>
  </article>
</main>

<footer>Rodapé</footer>
```

### ARIA Labels

```typescript
// Quando necessário (botões sem texto, ícones)
<Button aria-label="Fechar modal">
  <X className="h-4 w-4" />
</Button>

// Formulários
<Label htmlFor="email">E-mail</Label>
<Input id="email" type="email" aria-required="true" />
```

### Navegação por Teclado

- Todos os elementos interativos devem ser focáveis
- Ordem de foco lógica (Tab)
- Indicadores visuais de foco (Tailwind: `focus:ring-2 focus:ring-ring`)

### Contraste de Cores

- Sempre verificar contraste mínimo (WCAG AA: 4.5:1 para texto normal)
- Usar cores do tema (já testadas) quando possível
- Testar com ferramentas de acessibilidade

---

## ⚡ Performance

### Lazy Loading de Componentes

```typescript
import dynamic from 'next/dynamic'

// Carregar componente pesado apenas quando necessário
const AnotacaoEditor = dynamic(() => import('@/components/sessao/AnotacaoEditor'), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false, // se não precisa de SSR
})
```

### Otimização de Imagens

```typescript
import Image from 'next/image'

// ✅ Sempre usar Next.js Image
<Image
  src="/logo.png"
  alt="Sonar Logo"
  width={200}
  height={50}
  priority // se acima da dobra
/>
```

### Code Splitting

- Automático com App Router
- Route groups criam chunks separados
- Dynamic imports para componentes grandes

### Evitar Re-renders Desnecessários

```typescript
// ✅ Usar useMemo para cálculos pesados
const filteredPacientes = useMemo(() => {
  return pacientes.filter(p => p.ativo)
}, [pacientes])

// ✅ useCallback para funções passadas como props
const handleClick = useCallback(() => {
  // ...
}, [dependencies])
```

---

## 📱 Responsividade

### Mobile-First Approach

```typescript
// Classes base para mobile, breakpoints para desktop
<div className="
  flex flex-col gap-4        // mobile
  md:flex-row md:gap-8       // tablet+
  lg:gap-12                  // desktop
">
```

### Breakpoints do Tailwind

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Layout Adaptativo

```typescript
// Sidebar colapsável em mobile
'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <Menu />
      </button>
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-background
        transition-transform duration-200
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* conteúdo */}
      </aside>
    </>
  )
}
```

---

## 🔍 Metadata e SEO

### Metadata por Página

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pacientes | Sonar',
  description: 'Gerencie seus pacientes e acompanhe suas sessões',
  openGraph: {
    title: 'Pacientes | Sonar',
    description: 'Gerencie seus pacientes e acompanhe suas sessões',
    type: 'website',
  },
}

export default function PacientesPage() {
  // ...
}
```

### Metadata Dinâmica

```typescript
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const paciente = await buscarPaciente(params.id)

  return {
    title: `${paciente.nome} | Sonar`,
    description: `Sessões de ${paciente.nome}`,
  }
}
```

### Estrutura de Títulos Hierárquica

- H1: uma por página, título principal
- H2: seções principais
- H3: subseções
- Não pular níveis (ex: H1 → H3)

---

## 📚 Referências

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
