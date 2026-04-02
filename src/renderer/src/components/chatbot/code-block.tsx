import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Check, Copy } from 'lucide-react'

type Props = {
  code: string
  language?: string
  className?: string
}

const CodeBlock = ({ code, language, className = '' }: Props): React.JSX.Element => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={` rounded-md border bg-muted/40 ${className} my-2`}>
      <div className="flex items-center justify-between border-b bg-muted/60 px-2">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {language ?? 'code'}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs cursor-pointer"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="size-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Copy
            </>
          )}
        </Button>
      </div>

      <pre className="">
        <div className="max-h-[420px] overflow-auto p-2 text-xs leading-relaxed whitespace-pre-wrap">
          {code}
        </div>
      </pre>
    </div>
  )
}

export default CodeBlock
