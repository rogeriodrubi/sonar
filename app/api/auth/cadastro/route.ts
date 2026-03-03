import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, nome } = body

    // Validação básica
    if (!email || !password || !nome) {
      return NextResponse.json(
        { error: 'E-mail, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Para signup em Route Handler, usar createClient diretamente
    // (sem cookies, já que ainda não há sessão)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    // Criar perfil na tabela profiles
    // Usar service_role key para criar o perfil (necessário porque ainda não há sessão ativa)
    // A service_role key só deve estar disponível no servidor, nunca no cliente
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        nome,
        tipo: 'terapeuta',
      })

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      return NextResponse.json(
        { error: 'Erro ao criar perfil. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Cadastro realizado com sucesso',
        user: authData.user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro no cadastro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
