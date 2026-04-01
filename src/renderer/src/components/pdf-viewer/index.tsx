import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { usePDFStore } from '@renderer/hooks/use-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function PDFViewer(): React.JSX.Element {
  const { file, error, currentPage, setCurrentPage, setTotalPages, setDocumentError, scale, zoom } =
    usePDFStore()

  if (error) return <div>Error: {error}</div>
  if (!file) return <div>Loading...</div>

  return (
    <Document
      file={file}
      onLoadSuccess={({ numPages }) => {
        setTotalPages(numPages)
        setCurrentPage(1)
      }}
      onLoadError={(err) => setDocumentError(err.message)}
    >
      <Page
        pageNumber={currentPage}
        scale={scale * zoom}
        renderTextLayer={true}
        renderAnnotationLayer={true}
      />
    </Document>
  )
}
