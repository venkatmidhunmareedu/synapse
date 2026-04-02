import { Maximize, Minimize, Minus, Sparkles, X } from 'lucide-react'
import { Button } from '../ui/button'
import { maximise, minimize, close, restore } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useWindowStore } from '@renderer/hooks/use-window'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Option from './option'

const TitleBar = (): React.JSX.Element => {
  const [windowState, setWindowState] = useState<'MAXIMIZED' | 'UNMAXIMIZED'>('UNMAXIMIZED')
  const { openFileDialog, closeFile, filePath } = useWindowStore()
  useEffect(() => {
    window.api.onWindowStateChanged((state) => {
      setWindowState(state as 'MAXIMIZED' | 'UNMAXIMIZED')
    })
  }, [])
  const titleBarItems: {
    label: string
    options: {
      label: string
      enabled: boolean
      action: () => void
      shortcut?: string
    }[]
  }[] = [
    {
      label: 'File',
      options: [
        {
          label: 'Open PDF',
          enabled: filePath === null,
          action: () => openFileDialog(),
          shortcut: 'Ctrl+O'
        },
        {
          label: 'Close PDF',
          enabled: filePath !== null,
          action: () => closeFile()
          // shortcut: 'Ctrl+W'
        }
      ]
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
          <Sparkles size={25} className=" rounded p-1 m-0" />
          {/* <p className="text-sm font-semibold">Synapse</p> */}
        </div>

        {/* Title bar actions   */}
        <div className="flex items-center title-bar-no-drag-area">
          {titleBarItems.map((item) => (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  key={item.label}
                  className="flex m-0 items-center gap-1 hover:dark:bg-muted-foreground/20    text-xs hover:border-border"
                >
                  {item.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.options.map((option) => (
                  <Option
                    key={option.label}
                    label={option.label}
                    action={option.action}
                    shortcut={option.shortcut}
                    enabled={option.enabled}
                  />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
