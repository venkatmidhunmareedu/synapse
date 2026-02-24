import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { ReactNode } from 'react'

const KBD = ({ cmds }: { cmds: string[] }): React.JSX.Element => {
  return (
    <KbdGroup>
      {cmds.map((cmd, index) => (
        <>
          <Kbd key={index} className="rounded-none rounded-b-sm border-b-2 px-3">
            {cmd}
          </Kbd>
          {index === cmds.length - 1 ? null : <span>+</span>}
        </>
      ))}
    </KbdGroup>
  )
}

const EmptyState = (): React.JSX.Element => {
  const keyBoardBindings: { label: string; command: ReactNode }[] = [
    {
      label: 'Open a PDF',
      command: <KBD cmds={['Ctrl', 'o']} />
    },
    {
      label: 'Open command pallete',
      command: <KBD cmds={['Ctrl', 'k']} />
    },
    {
      label: 'Open Thumbnails',
      command: <KBD cmds={['Ctrl', 't']} />
    },
    {
      label: 'Open Annotations',
      command: <KBD cmds={['Ctrl', 'a']} />
    },
    {
      label: 'Open Bookmarks',
      command: <KBD cmds={['Ctrl', 'b']} />
    }
  ]
  return (
    <div className="flex items-center justify-center h-full cursor-none pointer-events-none select-none">
      <div className="text-left">
        <div className="text-2xl font-bold mb-2">Synapse</div>
        <p className="text-muted-foreground text-sm">
          Your AI powered PDF viewer and analysis companion
        </p>
        <br />
        <div className="flex flex-col text-sm text-gray-500 space-y-3">
          {keyBoardBindings.map((kb, index) => {
            return (
              <div className="grid grid-cols-2 items-center gap-6" key={index}>
                <div className="text-muted-foreground text-md">{kb.label}</div>
                <div>{kb.command}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default EmptyState
