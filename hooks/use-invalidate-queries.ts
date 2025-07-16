import { useQueryClient } from '@tanstack/react-query'

export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  async function invalidateQueries(queries: string[]) {
    if (queries.length === 0) return

    const promises = queries.map((query) => queryClient.invalidateQueries({ queryKey: [query] }))
    await Promise.all(promises)
  }

  return { invalidateQueries }
}
