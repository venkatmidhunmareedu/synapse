import { Textarea } from '../ui/textarea'

interface Props {
  input: string
  handleInputChange: (value: string) => void
  handleSubmit: () => void
  isStreaming: boolean
}

const ChatInput = ({
  input,
  handleInputChange,
  handleSubmit,
  isStreaming
}: Props): React.JSX.Element => {
  return (
    <div className="flex-1">
      <div className="h-full w-full">
        <Textarea
          value={input}
          disabled={isStreaming}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Ask anything, @ for context, / for commands"
          className="text-xs!  bg-transparent! border-none outline-none h-24 w-full resize-none pb-10 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              if (input.trim().length > 0) {
                handleSubmit()
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default ChatInput
