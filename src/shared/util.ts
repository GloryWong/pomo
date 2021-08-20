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
  const seconds = Math.round((minute - minutes) * 60)

  return {
    minutes: pad(minutes, 2),
    seconds: pad(seconds, 2),
  }
}

export function angleToMinute(angle: number, unitAngle: number): number {
  return angle / unitAngle
}

export function angleToSecond(angle: number, unitAngle: number): number {
  return angleToMinute(angle, unitAngle) * 60
}

export function minuteToAngle(minute: number, unitAngle: number): number {
  return minute * unitAngle
}

export function secondToAngle(second: number, unitAngle: number): number {
  return minuteToAngle(second / 60, unitAngle)
}
