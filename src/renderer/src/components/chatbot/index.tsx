import ChatInput from './chat-input'
import { ScrollArea } from '../ui/scroll-area'
import { useChat } from '@ai-sdk/react'
import { toolLoopAgent } from '@/lib/provider'
import { DirectChatTransport } from 'ai'
import { useMemo, useState } from 'react'
import ChatBubble from './chat-bubble'
import ChatActions from './chat-actions'
import EmptyState from './empty-state'

const transport = new DirectChatTransport({
  agent: toolLoopAgent
})

const ChatBot = (): React.JSX.Element => {
  const { messages, sendMessage, status, stop } = useChat({
    transport
  })
  const isStreaming = useMemo(() => status === 'streaming' || status !== 'ready', [status])
  const [input, setInput] = useState('')
  const handleInputChange = (value: string): void => {
    setInput(value)
  }
  const handleSubmit = (): void => {
    sendMessage({
      text: input
    })
    setInput('')
  }
  const handleSendMessage = (message: string): void => {
    sendMessage({
      text: message
    })
  }
  return (
    <div className="h-full flex flex-col justify-center items-center relative">
      {/* Chat Body */}
      <div className="h-[calc(100%-200px)] w-full">
        {messages.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center px-3">
            <EmptyState sendMessage={handleSendMessage} />
          </div>
        ) : (
          <ScrollArea className="h-full w-full px-3">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}
          </ScrollArea>
        )}
      </div>

      <br />
      <div className=" w-full p-2">
        <div className="border rounded-lg flex flex-col">
          {/* Chat Input */}
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isStreaming={isStreaming}
          />
          {/* Chat Actions */}
          <ChatActions handleSubmit={handleSubmit} isStreaming={isStreaming} stop={stop} />
        </div>
      </div>
    </div>
  )
}

export default ChatBot
