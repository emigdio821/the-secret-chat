import type { Participant } from '@twilio/conversations'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { envClient } from '@/lib/zod-schemas'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(d: Date) {
  const date = new Date(d)
  const today = new Date()
  const isToday = date.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)

  if (isToday) {
    return `Today, ${new Date(d).toLocaleString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  return new Date(d).toLocaleString([], {
    hour12: false,
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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

export function secsToTime(nTime?: number) {
  if (!nTime) return '0:00'
  const theTime = nTime
  const mins = Math.floor(theTime / 60)
  const secs = Math.floor(theTime % 60)
  let formattedSecs: string
  if (secs < 10) {
    formattedSecs = `0${String(secs)}`
    return `${mins}:${formattedSecs}`
  }
  return `${mins}:${secs}`
}
