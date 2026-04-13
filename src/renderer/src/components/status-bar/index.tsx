import { useWindowStore } from '@renderer/hooks/use-window'
import { EMBEDDING_STATUS } from '@renderer/lib/types'

const StatusBar = (): React.JSX.Element => {
  const { embeddingStatus } = useWindowStore()
  return (
    <div className="h-8 w-full flex justify-end space-x-2 items-center text-xs px-2">
      {embeddingStatus === EMBEDDING_STATUS.CHUNKING && (
        <span className="text-green-500">Chunking...</span>
      )}
      {embeddingStatus === EMBEDDING_STATUS.EMBEDDING && (
        <span className="text-yellow-500">Embedding...</span>
      )}
      {embeddingStatus === EMBEDDING_STATUS.EMBEDDED && (
        <span className="text-green-500">Embedded...</span>
      )}
      {embeddingStatus === EMBEDDING_STATUS.ERROR && <span className="text-red-500">Error...</span>}
    </div>
  )
}

export default StatusBar
