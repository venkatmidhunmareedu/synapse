import ChatInput from './chat-input'
import { ScrollArea } from '../ui/scroll-area'
import { useChat } from '@ai-sdk/react'
import { createToolLoopAgent } from '@/lib/provider'
import { DirectChatTransport } from 'ai'
import { useMemo, useState } from 'react'
import ChatBubble from './chat-bubble'
import ChatActions from './chat-actions'
import EmptyState from './empty-state'
import { usePDFStore } from '@/hooks/use-pdf'
import { useWindowStore } from '@renderer/hooks/use-window'

const ChatBot = (): React.JSX.Element => {
  const { setCurrentPage, totalPages, currentPage } = usePDFStore()
  const { filePath } = useWindowStore()
  const toolLoopAgent = useMemo(
    () =>
      createToolLoopAgent({
        setCurrentPage,
        getTotalPages: () => totalPages,
        getPDFInfo: () => ({ currentPage, totalPages, filePath: filePath ?? '' })
      }),
    [setCurrentPage, totalPages, currentPage, filePath]
  )
  const transport = useMemo(
    () =>
      new DirectChatTransport({
        agent: toolLoopAgent,
        sendReasoning: true,
        sendSources: true
      }),
    [toolLoopAgent]
  )

  const { messages, sendMessage, status, stop } = useChat({
    transport,
    onFinish: (message) => {
      console.log(message)
    }
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
            {status === 'streaming' && (
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-muted-foreground"></span>
                <p>Synapse is thinking...</p>
              </div>
            )}
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
