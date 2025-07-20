import type { Participant } from '@twilio/conversations'
import { clsx, type ClassValue } from 'clsx'
import { format, isToday, isYesterday } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { envClient } from '@/lib/zod-schemas'

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

export function getFirstName(n: string) {
  return n.split(' ')[0]
}

interface SortArrayProps<T> {
  items: T[]
  key: keyof T
  comparator?: string
}

export function sortArray<T>({ items, key, comparator }: SortArrayProps<T>) {
  if (!key) return items

  if (comparator) {
    return items.sort((x, y) => {
      if (x[key] === comparator) return -1
      if (y[key] === comparator) return 1
      return 0
    })
  }

  return items.sort((x, y) => {
    let xVal = x[key] || ''
    let yVal = y[key] || ''

    if (typeof xVal === 'string') {
      xVal = xVal.toLowerCase()
    }
    if (typeof yVal === 'string') {
      yVal = yVal.toLowerCase()
    }

    if (xVal < yVal) return -1
    if (xVal > yVal) return 1
    return 0
  })
}

export function isAdmin(part: Participant) {
  return part.roleSid === envClient.NEXT_PUBLIC_TWILIO_CHANNEL_ADMIN
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
