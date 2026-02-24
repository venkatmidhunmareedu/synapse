import { Minus, Sparkles, Square, X } from 'lucide-react'
import { Button } from '../ui/button'

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
      action: () => {
        // TODO: Implement action
      }
    },
    {
      id: 'maximize',
      icon: <Square size={14} />,
      action: () => {
        // TODO: Implement action
      }
    },
    {
      id: 'close',
      icon: <X size={16} />,
      action: () => {
        // TODO: Implement action
      }
    }
  ]

  return (
    <div className="flex w-full h-12 bg-background gap-3 title-bar-drag-area">
      {/* Left side - Brand and actions */}
      <div className="flex w-full gap-3 items-center">
        {/* Brand */}

        <div
          className="flex items-center gap-1 p-2 title-bar-no-drag-area cursor-default select-none pointer-events-none"
          aria-hidden="true"
        >
          <Sparkles size={22} className="bg-primary rounded p-1" />
          <p className="text-sm font-semibold">Synapse</p>
        </div>

        {/* Title bar actions   */}
        <div className="flex items-center title-bar-no-drag-area">
          {titleBarItems.map((item) => (
            <Button
              variant={'ghost'}
              size={'sm'}
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-1 hover:dark:bg-muted-foreground/20    text-xs hover:border-border"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Right side - Window controls */}
      <div className="flex items-center title-bar-no-drag-area px-2 gap-2">
        {windowControls.map((control) => (
          <button
            // variant={'ghost'}
            // size={'icon-xs'}
            key={control.id}
            onClick={control.action}
            className="flex hover:dark:bg-muted-foreground/20 hover:border-border p-2 rounded-sm"
          >
            {control.icon}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TitleBar
