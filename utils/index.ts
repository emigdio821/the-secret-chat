export default function formatDate(d: Date) {
  return new Date(d).toLocaleString([], {
    hour12: false,
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
