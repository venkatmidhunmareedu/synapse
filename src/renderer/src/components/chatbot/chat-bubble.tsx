import React from 'react'
import { UIMessage } from 'ai'
import { Card } from '../ui/card'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './code-block'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { cn } from '@renderer/lib/utils'
import Latex from 'react-latex-next'
import 'katex/dist/katex.min.css'

type Props = {
  message: UIMessage
}

function renderLatexText(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return <Latex>{child}</Latex>
    }
    return child
  })
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
            <div key={index} className="text-xs w-[calc(100%-2rem)]">
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
                  },
                  table({ className, children, ...props }) {
                    return (
                      <Table className={cn(className, 'text-xs my-1')} {...props}>
                        {children}
                      </Table>
                    )
                  },
                  thead({ className, children, ...props }) {
                    return (
                      <TableHeader className={className} {...props}>
                        {children}
                      </TableHeader>
                    )
                  },
                  tbody({ className, children, ...props }) {
                    return (
                      <TableBody className={className} {...props}>
                        {children}
                      </TableBody>
                    )
                  },
                  tfoot({ className, children, ...props }) {
                    return (
                      <TableFooter className={className} {...props}>
                        {children}
                      </TableFooter>
                    )
                  },
                  tr({ className, children, ...props }) {
                    return (
                      <TableRow className={className} {...props}>
                        {children}
                      </TableRow>
                    )
                  },
                  th({ className, children, ...props }) {
                    return (
                      <TableHead className={className} {...props}>
                        {renderLatexText(children)}
                      </TableHead>
                    )
                  },
                  td({ className, children, ...props }) {
                    return (
                      <TableCell className={className} {...props}>
                        {renderLatexText(children)}
                      </TableCell>
                    )
                  },
                  caption({ className, children, ...props }) {
                    return (
                      <TableCaption className={className} {...props}>
                        {children}
                      </TableCaption>
                    )
                  },
                  p({ className, children, ...props }) {
                    return (
                      <p className={cn(className, 'text-xs my-1')} {...props}>
                        {renderLatexText(children)}
                      </p>
                    )
                  },
                  ul({ className, children, ...props }) {
                    return (
                      <ul
                        className={cn(className, 'text-xs my-2')}
                        {...props}
                      >
                        {children}
                      </ul>
                    )
                  },
                  ol({ className, children, ...props }) {
                    return (
                      <ol className={cn(className, 'text-xs my-2 list-decimal')} {...props}>
                        {children}
                      </ol>
                    )
                  },
                  li({ className, children, ...props }) {
                    return (
                      <li className={cn(className, 'text-xs')} {...props}>
                        {renderLatexText(children)}
                      </li>
                    )
                  },
                  h1({ className, children, ...props }) {
                    return (
                      <h1 className={cn(className, 'text-xl my-1')} {...props}>
                        {renderLatexText(children)}
                      </h1>
                    )
                  },
                  h2({ className, children, ...props }) {
                    return (
                      <h2 className={cn(className, 'text-lg font-bold my-1')} {...props}>
                        {renderLatexText(children)}
                      </h2>
                    )
                  },
                  h3({ className, children, ...props }) {
                    return (
                      <h3 className={cn(className, 'text-md my-1')} {...props}>
                        {renderLatexText(children)}
                      </h3>
                    )
                  },
                  h4({ className, children, ...props }) {
                    return (
                      <h4 className={cn(className, 'text-base my-1')} {...props}>
                        {renderLatexText(children)}
                      </h4>
                    )
                  },
                  h5({ className, children, ...props }) {
                    return (
                      <h5 className={cn(className, 'text-sm my-1')} {...props}>
                        {renderLatexText(children)}
                      </h5>
                    )
                  },
                  h6({ className, children, ...props }) {
                    return (
                      <h6 className={cn(className, 'text-xs my-1 font-bold')} {...props}>
                        {renderLatexText(children)}
                      </h6>
                    )
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
