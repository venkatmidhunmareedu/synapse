import { ArrowRight, Sparkle } from 'lucide-react'
import React from 'react'

const EmptyState = ({
  sendMessage
}: {
  sendMessage: (message: string) => void
}): React.JSX.Element => {
  const actions = [
    {
      label: 'Summarize the document',
      onClick: () => {
        sendMessage('Summarize the document')
      }
    },
    {
      label: 'Extract key points and main ideas',
      onClick: () => {
        sendMessage('Extract key points and main ideas')
      }
    },
    {
      label: 'Generate a list of questions based on the document',
      onClick: () => {
        sendMessage('Generate a list of questions based on the document')
      }
    },
    {
      label: 'Find action items or tasks',
      onClick: () => {
        sendMessage('Find action items or tasks')
      }
    },
    {
      label: 'Identify sentiment and tone of the document',
      onClick: () => {
        sendMessage('Identify sentiment and tone of the document')
      }
    },
    {
      label: 'List important names, dates, and organizations',
      onClick: () => {
        sendMessage('List important names, dates, and organizations')
      }
    },
    {
      label: 'Detect potential issues or risks mentioned',
      onClick: () => {
        sendMessage('Detect potential issues or risks mentioned')
      }
    }
  ]
  return (
    <div className="w-full max-w-xl ">
      <div className="flex flex-col items-start gap-3 pointer-events-none select-none">
        <span className="flex items-center gap-2">
          <Sparkle className="size-5" />
          <p className="text-2xl font-bold">Synapse</p>
        </span>
        <p className="text-xs text-muted-foreground">Ask me anything about the document</p>
      </div>
      <br />
      <div className="text-xs font-semibold mb-2">Friendly Actions</div>
      <div className="flex flex-col gap-1">
        {actions.map((action) => (
          <div
            key={action.label}
            onClick={action.onClick}
            className=" flex items-center text-xs text-muted-foreground rounded-md group cursor-pointer hover:text-foreground transition-colors duration-200"
          >
            <div className="flex items-center">{action.label}</div>
            <div>
              <ArrowRight className="size-3 hidden ml-1 group-hover:inline-block transition-all duration-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmptyState
