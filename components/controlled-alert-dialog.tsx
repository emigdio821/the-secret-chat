import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

interface AlertDialogProps {
  open: boolean
  action: () => void
  alertMessage?: React.ReactNode
  trigger?: React.ReactNode
  setOpen: (open: boolean) => void
  isLoading?: boolean
}

export function ControlledAlertDialog({ open, action, trigger, setOpen, isLoading, alertMessage }: AlertDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isLoading) {
          setOpen(isOpen)
        }
      }}
    >
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            onClick={() => {
              setOpen(true)
            }}
          >
            Open
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          {alertMessage && <AlertDialogDescription>{alertMessage}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={(e) => {
              e.preventDefault()
              action()
            }}
          >
            Continue
            {isLoading && <Icons.Spinner />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
