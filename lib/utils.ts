import { clsx, type ClassValue } from 'clsx'
import { format, isToday, isYesterday } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  const parsedDate = new Date(date)

  if (isToday(parsedDate)) {
    return `Today, ${format(parsedDate, 'HH:mm')}`
  }

  if (isYesterday(parsedDate)) {
    return `Yesterday, ${format(parsedDate, 'HH:mm')}`
  }

  return format(parsedDate, 'MMM dd, yyyy, HH:mm')
}

export function byteFormatter(bytes: number, decimals: number = 0) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export function formatSecondsToTime(secs: number) {
  if (!Number.isFinite(secs)) return '0:00'
  const minutes = Math.floor(secs / 60)
  const seconds = Math.floor(secs % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
