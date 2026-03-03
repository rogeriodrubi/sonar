'use client'

interface Props {
  audioUrl: string
  duracaoMinutos: number
}

export function AudioPlayer({ audioUrl, duracaoMinutos }: Props) {
  return (
    <div>
      <p>AudioPlayer em desenvolvimento</p>
      <p>URL: {audioUrl}</p>
      <p>Duração: {duracaoMinutos} minutos</p>
    </div>
  )
}

export default AudioPlayer
