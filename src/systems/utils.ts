export const rnd = (a: number, b: number) => a + Math.random() * (b - a)
export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export function circleRectOverlap(
  cx: number, cy: number, r: number,
  rx: number, ry: number, rw: number, rh: number
): boolean {
  const nearX = clamp(cx, rx, rx + rw)
  const nearY = clamp(cy, ry, ry + rh)
  const dx = cx - nearX
  const dy = cy - nearY
  return dx * dx + dy * dy < r * r
}
