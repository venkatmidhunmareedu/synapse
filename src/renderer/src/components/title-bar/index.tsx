import { Maximize, Minimize, Minus, Sparkles, X } from 'lucide-react'
import { Button } from '../ui/button'
import { maximise, minimize, close, restore } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { BaseIcon } from '../icons'

const TitleBar = (): React.JSX.Element => {
  const [windowState, setWindowState] = useState<'MAXIMIZED' | 'UNMAXIMIZED'>('UNMAXIMIZED')
  useEffect(() => {
    window.api.onWindowStateChanged((state) => {
      setWindowState(state as 'MAXIMIZED' | 'UNMAXIMIZED')
    })
  }, [])
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
        icon: windowState === 'MAXIMIZED' ? <Minimize size={14} /> : <Maximize size={14} />,
        action: async () => {
          if (windowState === 'MAXIMIZED') {
            await restore()
          } else {
            await maximise()
          }
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
    <div className="flex justify-between  w-full h-10 bg-background title-bar-drag-area m-0">
      {/* Left side - Brand and actions */}
      <div className="flex w-full items-center mx-0 px-0">
        {/* Brand */}

        <div
          className=" flex items-center justify-center title-bar-no-drag-area cursor-default select-none pointer-events-none w-[54px] p-0 m-0"
          aria-hidden="true"
        >
          <div className='bg-white rounded-sm'>
            <BaseIcon className='text-black size-6 font-bold' strokeWidth={32} />
          </div>
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
              'flex justify-center px-2 items-center hover:dark:bg-muted-foreground/20 hover:border-border h-full w-full transition-all duration-200',
              control.id === 'close' && 'hover:bg-red-500! hover:text-white'
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
