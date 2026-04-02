import React from 'react'
import { Button } from '../ui/button'
import { ArrowUp, Square } from 'lucide-react'

type Props = {
  handleSubmit: () => void
  isStreaming: boolean
  stop: () => void
}

const ChatActions = ({ handleSubmit, isStreaming, stop }: Props): React.JSX.Element => {
  const handleStreaming = (): void => {
    if (isStreaming) stop()
    else handleSubmit()
  }
  return (
    <div className=" flex justify-end p-1">
      <Button
        variant="default"
        className="px-2 py-1 rounded-full"
        size={'icon'}
        onClick={handleStreaming}
      >
        {isStreaming ? (
          <Square className="size-3 stroke-3 fill-current" />
        ) : (
          <ArrowUp className="size-4 stroke-3" />
        )}
      </Button>
    </div>
  )
}
export default ChatActions
