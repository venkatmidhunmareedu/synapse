import { usePDFStore } from '@renderer/hooks/use-pdf'
import EmptyState from './empty-state'
import { MessageSquare } from 'lucide-react'

const Annotations = (): React.JSX.Element => {
  const { annotations } = usePDFStore()
  return (
    <div className="h-full">
      <div className="h-full">
        {annotations?.length > 0 ? (
          annotations.map((thumbnail, index) => <div key={index}>{thumbnail}</div>)
        ) : (
          <EmptyState
            desc="No annotations available"
            icon={<MessageSquare className="h-8 w-8" />}
          />
        )}
      </div>
    </div>
  )
}

export default Annotations
