import React from 'react'
import { UIMessage } from 'ai'
import { Card } from '../ui/card'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './code-block'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'

type Props = {
  message: UIMessage
}

const ChatBubble = ({ message }: Props): React.JSX.Element => {
  return (
    <div className="w-full h-full overflow-y-auto my-2">
      {message.parts.map((part, index) => {
        if (part.type === 'text') {
          if (message.role === 'user') {
            return (
              <div key={index} className="flex justify-end">
                <Card className="text-xs text-right border px-2 py-1 w-fit">{part.text}</Card>
              </div>
            )
          }
          return (
            <div key={index} className="text-xs">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    const code = String(children).replace(/\n$/, '')

                    if (!className) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }

                    return <CodeBlock code={code} language={match?.[1]} />
                  },
                  pre({ children }) {
                    return <pre className="text-red">{children}</pre>
                  }
                }}
              >
                {part.text}
              </Markdown>
            </div>
          )
        }
        if (part.type === 'reasoning') {
          return (
            <div
              key={index}
              className="text-xs italic text-muted-foreground"
              style={{ opacity: 0.6 }}
            >
              {part.text}
            </div>
          )
        }
        const isToolPart = part.type === 'dynamic-tool' || part.type.startsWith('tool-')
        if (isToolPart && 'state' in part) {
          const toolName = 'toolName' in part ? part.toolName : part.type.replace('tool-', '')

          switch (part.state) {
            case 'input-streaming':
              return (
                <div key={index} className="text-xs text-muted-foreground">
                  <p> executing {toolName} ... </p>
                </div>
              )
            case 'input-available':
              return (
                <div key={index} className="text-xs text-muted-foreground  ">
                  <p>{toolName} input available</p>
                </div>
              )
            case 'output-available':
              return (
                <div key={index} className="text-xs text-muted-foreground">
                  <Accordion type="single" collapsible>
                    <AccordionItem value={toolName} className="">
                      <AccordionTrigger className="text-xs text-muted-foreground">
                        {toolName} {JSON.stringify(part?.input)}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">
                        <p>{part?.output as string}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )
            case 'output-error':
              return (
                <div key={index} className="text-xs text-muted-foreground">
                  <p>{toolName} output error</p>
                </div>
              )
            default:
              return (
                <div key={index} className="text-xs text-muted-foreground">
                  <p>{toolName} running...</p>
                </div>
              )
          }
        }
        return null
      })}
    </div>
  )
}

export default ChatBubble
