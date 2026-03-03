# Sonar — Especificação Geral

## O que é o Sonar?
O Sonar é uma plataforma web que permite gravar, armazenar e explorar sessões de psicoterapia. Funciona como um dispositivo de amplificação subjetiva — transforma a fala efêmera da sessão em um território explorável, dando ao paciente e ao terapeuta uma "segunda visão" sobre o que foi dito.

## Problema que resolve
A fala produzida em sessões terapêuticas é rica em padrões, entrelinhas e nuances afetivas que se perdem porque não existe registro acessível e organizado. O Sonar captura esse material e o preserva, permitindo a historicização do processo analítico.

## Usuários
- **Terapeuta**: Gerencia seus pacientes, sessões e anotações clínicas. É o pagante da plataforma.
- **Paciente**: Acessa suas próprias sessões e adiciona reflexões pessoais. Acesso gratuito, vinculado ao terapeuta.

## Stack
- **Frontend**: Next.js (App Router)
- **Backend / Auth / Storage**: Supabase (Postgres + Auth + Storage)
- **Hospedagem**: Vercel
- **Linguagem**: TypeScript (strict mode)

## Modelo de Acesso
- Terapeuta cria conta e assina um plano pago
- Terapeuta convida pacientes via e-mail ou link
- Paciente acessa gratuitamente, com escopo limitado às suas próprias sessões

## Decisões já tomadas
- IA não faz parte da v1 — foco em gravação, armazenamento e acesso humano
- Anotações de terapeuta e paciente são separadas e privadas entre si
- Arquivos de áudio armazenados no Supabase Storage
- Transcrições podem ser enviadas manualmente (upload de texto) ou geradas futuramente por IA
