import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r">
        <nav className="p-4">
          <h2 className="text-lg font-semibold">Sonar</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="/pacientes" className="text-sm hover:underline">
                Pacientes
              </a>
            </li>
            <li>
              <a href="/sessoes/nova" className="text-sm hover:underline">
                Nova Sessão
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
