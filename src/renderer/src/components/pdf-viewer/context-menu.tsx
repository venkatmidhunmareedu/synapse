import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { usePDFStore } from '@renderer/hooks/use-pdf'
import { useWindowStore } from '@renderer/hooks/use-window'

export default function CustomContextMenu({
  children
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { currentPage, totalPages, setCurrentPage, scale, setScale, file } = usePDFStore()
  const { filePath } = useWindowStore()

  const selectedText = window.getSelection()?.toString().trim() ?? ''
  const hasSelection = selectedText.length > 0
  const hasDocument = Boolean(file)
  const canZoomOut = scale > 1
  const canZoomIn = scale < 10
  const canGoPrev = currentPage > 1
  const canGoNext = totalPages > 0 && currentPage < totalPages

  const triggerAIAction = (action: string, payload?: Record<string, string | number>): void => {
    window.dispatchEvent(
      new CustomEvent('pdf-ai-action', {
        detail: {
          action,
          page: currentPage,
          totalPages,
          filePath,
          selectedText: hasSelection ? selectedText : null,
          ...payload
        }
      })
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onContextMenu={(e) => e.stopPropagation()}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 scale-75">
        <ContextMenuLabel>AI PDF Assistant</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Ask AI</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-64">
              <ContextMenuItem
                disabled={!hasSelection}
                onSelect={() => triggerAIAction('explain-selection')}
              >
                Explain selected text
              </ContextMenuItem>
              <ContextMenuItem
                disabled={!hasSelection}
                onSelect={() => triggerAIAction('simplify-selection')}
              >
                Simplify selected text
              </ContextMenuItem>
              <ContextMenuItem
                disabled={!hasSelection}
                onSelect={() => triggerAIAction('key-points-selection')}
              >
                Extract key points
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                disabled={!hasDocument}
                onSelect={() => triggerAIAction('summarize-page')}
              >
                Summarize this page
              </ContextMenuItem>
              <ContextMenuItem
                disabled={!hasDocument}
                onSelect={() => triggerAIAction('find-action-items')}
              >
                Find action items
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem
            disabled={!hasSelection}
            onSelect={() => void navigator.clipboard.writeText(selectedText)}
          >
            Copy selected text
            <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!hasSelection}
            onSelect={() => triggerAIAction('ask-about-selection')}
          >
            Ask about selection
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>
            Page {currentPage} / {totalPages || '-'}
          </ContextMenuItem>
          <ContextMenuItem disabled={!canGoPrev} onSelect={() => setCurrentPage(currentPage - 1)}>
            Previous page
            <ContextMenuShortcut>PgUp</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled={!canGoNext} onSelect={() => setCurrentPage(currentPage + 1)}>
            Next page
            <ContextMenuShortcut>PgDn</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            disabled={!canZoomOut}
            onSelect={() => setScale(Math.max(1, scale - 0.5))}
          >
            Zoom out
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!canZoomIn}
            onSelect={() => setScale(Math.min(10, scale + 0.5))}
          >
            Zoom in
          </ContextMenuItem>
          <ContextMenuItem disabled={scale === 1} onSelect={() => setScale(1)}>
            Reset zoom
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            disabled={!filePath}
            onSelect={() => filePath && void navigator.clipboard.writeText(filePath)}
          >
            Copy file path
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
