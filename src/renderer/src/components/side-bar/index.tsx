import { Rows3, MessageSquare, BookMarked } from 'lucide-react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useWindowStore } from '@renderer/hooks/use-window'
import { cn } from '@renderer/lib/utils'
import Thumbnails from './thumbnails'
import Annotations from './annotations'
import Bookmarks from './bookmarks'

const SideBar = (): React.JSX.Element => {
  const sideBarItems: {
    label: string
    identifier: string
    icon: React.ReactNode
    commands: string[]
  }[] = [
    {
      label: 'Thumbnails',
      identifier: 'thumbnails',
      icon: <Rows3 className="w-10 h-10" />,
      commands: ['Ctrl', 't']
    },
    {
      label: 'Annotations',
      identifier: 'annotations',
      icon: <MessageSquare className="w-10 h-10" />,
      commands: ['Ctrl', 'a']
    },
    {
      label: 'Bookmarks',
      identifier: 'bookmarks',
      icon: <BookMarked className="w-10 h-10" />,
      commands: ['Ctrl', 'b']
    }
  ]

  const { currentView, setCurrentView } = useWindowStore()
  const renderView = (): React.JSX.Element => {
    switch (currentView) {
      case 'thumbnails':
        return <Thumbnails />
      case 'annotations':
        return <Annotations />
      case 'bookmarks':
        return <Bookmarks />
      default:
        return <Thumbnails />
    }
  }
  return (
    <div className="h-full flex">
      <div className="flex flex-col justify-start items-center w-[65px] border-r py-1">
        {sideBarItems.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant={'ghost'}
                size={'icon-lg'}
                className={cn(
                  'w-full m-0 p-0 rounded-none hover:bg-background/10 opacity-50 hover:opacity-100',
                  currentView === item.identifier && 'opacity-100 bg-primary/30'
                )}
                key={item.label}
                onClick={() =>
                  setCurrentView(item.identifier as 'thumbnails' | 'annotations' | 'bookmarks')
                }
              >
                {item.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-muted text-foreground flex gap-2">
              <p>{item.label}</p>
              {item.commands && (
                <div className="flex">
                  {'('}
                  {item.commands.map((command, index) => (
                    <>
                      <p key={index} className="text-xs">
                        {command}
                      </p>
                      {index === item.commands.length - 1 ? null : <span>+ </span>}
                    </>
                  ))}
                  {')'}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex flex-col items-center justify-start h-full px-3 w-full ">
        <div className="flex flex-col items-start justify-center w-full h-10 pointer-events-none select-none ">
          <p className="text-xs font-semibold">
            {sideBarItems.find((item) => item.identifier === currentView)?.label}
          </p>
        </div>
        <div className="h-full w-full overflow-y-auto my-1">{renderView()}</div>
      </div>
    </div>
  )
}

export default SideBar
