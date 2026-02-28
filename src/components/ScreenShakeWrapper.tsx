import { ReactNode } from 'react'

interface Props {
  shaking: boolean
  children: ReactNode
}

export default function ScreenShakeWrapper({ shaking, children }: Props) {
  return (
    <div
      style={{
        transition: shaking ? 'none' : 'transform 0.15s ease-out',
        transform: shaking
          ? `translate(${(Math.random() - 0.5) * 7}px, ${(Math.random() - 0.5) * 7}px)`
          : 'translate(0,0)',
      }}
    >
      {children}
    </div>
  )
}
