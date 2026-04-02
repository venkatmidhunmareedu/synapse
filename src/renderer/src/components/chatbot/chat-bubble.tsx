import React from 'react'
import { UIMessage } from 'ai'
import { Card, CardContent } from '../ui/card'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './code-block'

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
            <CardContent key={index} className="text-xs italic text-muted-foreground">
              <p style={{ opacity: 0.6 }}>{part.text}</p>
            </CardContent>
          )
        }
        return null
      })}
    </div>
  )
}

export default ChatBubble
