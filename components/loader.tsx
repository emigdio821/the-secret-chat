import { Icons } from './icons'

export function Loader({ msg }: { msg?: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-muted/50 flex flex-col items-center gap-1 rounded-md border border-dashed p-4">
        <Icons.Spinner />
        <span className="text-muted-foreground text-sm">{msg || 'Loading'}</span>
      </div>
    </div>
  )
}
