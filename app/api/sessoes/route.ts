import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createServerClient()
  
  // TODO: Implementar busca de sessões
  return NextResponse.json({ message: 'Endpoint de sessões em desenvolvimento' })
}

export async function POST() {
  const supabase = await createServerClient()
  
  // TODO: Implementar criação de sessão
  return NextResponse.json({ message: 'Criação de sessão em desenvolvimento' })
}
