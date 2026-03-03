'use client'

interface Props {
  onRecordingComplete?: (blob: Blob) => void
}

export function GravadorAudio({ onRecordingComplete }: Props) {
  return (
    <div>
      <p>GravadorAudio em desenvolvimento</p>
    </div>
  )
}

export default GravadorAudio
