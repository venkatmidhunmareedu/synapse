import { Minus, Sparkles, Square, X } from 'lucide-react'
import { Button } from '../ui/button'
import { maximise, minimize, close } from '@/lib/api'
import { cn } from '@/lib/utils'

const TitleBar = (): React.JSX.Element => {
  const titleBarItems: {
    label: string
    action: () => void
  }[] = [
    {
      label: 'File',
      action: () => {
        // TODO: Implement action
      }
    },
    {
      label: 'Edit',
      action: () => {
        // TODO: Implement action
      }
    }
  ]

  const windowControls: {
    id: string
    icon: React.ReactNode
    action: () => void
  }[] = [
    {
      id: 'minimize',
      icon: <Minus size={14} />,
      action: async () => {
        await minimize()
      }
    },
    {
      id: 'maximize',
      icon: <Square size={14} />,
      action: async () => {
        await maximise()
      }
    },
    {
      id: 'close',
      icon: <X size={16} />,
      action: async () => {
        await close()
      }
    }
  ]

  return (
    <div className="flex justify-between  w-full h-10 bg-background title-bar-drag-area">
      {/* Left side - Brand and actions */}
      <div className="flex w-full items-center mx-0 px-0">
        {/* Brand */}

        <div
          className="flex items-center justify-center title-bar-no-drag-area cursor-default select-none pointer-events-none w-[65px]"
          aria-hidden="true"
        >
          <Sparkles size={25} className=" rounded p-1" />
          {/* <p className="text-sm font-semibold">Synapse</p> */}
        </div>

        {/* Title bar actions   */}
        <div className="flex items-center title-bar-no-drag-area">
          {titleBarItems.map((item) => (
            <Button
              variant={'ghost'}
              size={'sm'}
              key={item.label}
              onClick={item.action}
              className="flex m-0 items-center gap-1 hover:dark:bg-muted-foreground/20    text-xs hover:border-border"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Right side - Window controls */}
      <div className="flex items-center title-bar-no-drag-area px-3 gap-2">
        {windowControls.map((control) => (
          <button
            key={control.id}
            onClick={control.action}
            className={cn(
              'flex justify-center px-2 items-center hover:dark:bg-muted-foreground/20 hover:border-border h-full',
              control.id === 'close' && 'hover:bg-destructive hover:text-destructive'
            )}
          >
            {control.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TitleBar
