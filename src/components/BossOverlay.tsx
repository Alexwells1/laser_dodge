interface Props {
  countdown: number
}

export default function BossOverlay({ countdown }: Props) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-start pt-4 pointer-events-none"
    >
      <div
        className="rounded-lg px-5 py-2 flex flex-col items-center gap-1"
        style={{
          background: 'rgba(80,0,80,0.35)',
          border: '1px solid rgba(255,0,255,0.5)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div
          className="boss-text text-base font-black tracking-[0.4em]"
          style={{ fontFamily: "'Orbitron', monospace", color: '#f0f' }}
        >
          ⚡ BOSS PHASE
        </div>
        <div
          className="text-xl font-bold tracking-wider"
          style={{ color: '#f0f', textShadow: '0 0 10px #f0f' }}
        >
          {countdown}s
        </div>
      </div>
    </div>
  )
}
