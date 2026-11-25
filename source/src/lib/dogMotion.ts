export interface Point { x: number; y: number }

export const careHotspots: Record<string, Point & { r: number; label: string }> = {
  ears: { x: 73, y: 121, r: 24, label: '귀' },
  eyes: { x: 150, y: 143, r: 28, label: '눈' },
  nose: { x: 150, y: 176, r: 14, label: '코' },
  mouth: { x: 150, y: 203, r: 15, label: '입' },
  fur: { x: 271, y: 236, r: 28, label: '피부' },
  paws: { x: 232, y: 344, r: 28, label: '발' },
  tail: { x: 340, y: 162, r: 26, label: '꼬리' },
  back: { x: 262, y: 175, r: 23, label: '등' },
};

/** Keep the whole pupil inside the sclera while turning toward the selected part. */
export function pupilOffset(eye: Point, target: Point | null): Point {
  if (!target) return { x: 0, y: 0 };
  const dx = target.x - eye.x;
  const dy = target.y - eye.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.001) return { x: 0, y: 0 };
  const travel = Math.min(3.6, distance / 10);
  return { x: dx / distance * travel, y: dy / distance * travel };
}
