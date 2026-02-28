import { ReactNode } from 'react'

interface Props {
  angle: number
  children: ReactNode
}

export default function ArenaRotationWrapper({ angle, children }: Props) {
  return (
    <div
      style={{
        transform: `rotate(${angle}deg)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {children}
    </div>
  )
}
