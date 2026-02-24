import { ThemeProvider } from './components/theme-provider'
import Layout from '@/components/layout'
import Canvas from '@/components/canvas'
import { TooltipProvider } from './components/ui/tooltip'
import 'pdfjs-dist/web/pdf_viewer.css'
import { pdf } from './lib/files'
import { PDFProvider } from './hooks/use-pdf'

function App(): React.JSX.Element {
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <PDFProvider url={pdf}>
          <Layout>
            <Canvas />
          </Layout>
        </PDFProvider>
      </ThemeProvider>
    </TooltipProvider>
  )
}

export default App
