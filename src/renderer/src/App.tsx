import { ThemeProvider } from './components/theme-provider'
import Layout from '@/components/layout'
import Canvas from '@/components/canvas'
import { TooltipProvider } from './components/ui/tooltip'
import 'pdfjs-dist/web/pdf_viewer.css'
import { PDFProvider } from './hooks/use-pdf'
import { WindowProvider } from './hooks/use-window'

function App(): React.JSX.Element {
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <WindowProvider>
          <PDFProvider>
            <Layout>
              <Canvas />
            </Layout>
          </PDFProvider>
        </WindowProvider>
      </ThemeProvider>
    </TooltipProvider>
  )
}

export default App
