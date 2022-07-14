import { Participant, User } from '@twilio/conversations'

export function formatDate(d: Date) {
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

type SortValue = string
export function sortArray(
  items: any[],
  sortBy: string,
  sortByValue?: SortValue,
) {
  if (!sortBy) return items

  if (sortByValue) {
    return items.sort((x, y) => {
      if (x[sortBy] === sortByValue) return -1
      if (y[sortBy] === sortByValue) return 1
      return 0
    })
  }

  return items.sort((x, y) => {
    const xVal = x[sortBy].toLowerCase()
    const yVal = y[sortBy].toLowerCase()
    if (xVal < yVal) return -1
    if (xVal > yVal) return 1
    return 0
  })
}

export function getPartFName(part: Participant) {
  // @ts-ignore
  if (part.attributes?.friendlyName) {
    // @ts-ignore
    return part.attributes.friendlyName
  }
  return part.identity
}

export function getAvatar(user: User) {
  // @ts-ignore
  if (user.attributes?.avatar) {
    // @ts-ignore
    return user.attributes.avatar
  }
  return ''
}
