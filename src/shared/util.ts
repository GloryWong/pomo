export function roundAngle(angle: number, unit: number): number {
  return Math.round(angle / unit) * unit
}

export function pad(number: number, digitLength: number): string {
  const padLength = Math.pow(10, digitLength - 1)
  return number >= padLength
    ? String(number)
    : new Array(digitLength - 1).fill('0').join('').concat(String(number))
}

export function formatMinute(minute: number): {
  minutes: string
  seconds: string
} {
  const minutes = Math.floor(minute)
  const seconds = Math.floor((minute - minutes) * 60)

  return {
    minutes: pad(minutes, 2),
    seconds: pad(seconds, 2),
  }
}
