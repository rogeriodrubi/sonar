import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createServerClient()
  
  // TODO: Implementar upload de arquivos
  return NextResponse.json({ message: 'Upload em desenvolvimento' })
}
