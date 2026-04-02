import { usePDFStore } from '@renderer/hooks/use-pdf'
import MenuBar from './menu-bar'
import SideBar from './side-bar'
// import StatusBar from './status-bar'
import TitleBar from './title-bar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'
import ChatBot from './chatbot'

const Layout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const { totalPages } = usePDFStore()
  return (
    <div className="flex flex-col h-screen w-screen">
      <TitleBar />
      <ResizablePanelGroup orientation="horizontal" className="overflow-y-auto border-t border-b">
        {totalPages > 0 && (
          <>
            <ResizablePanel defaultSize={20} minSize={20}>
              <SideBar />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary w-[2px]" withHandle />
          </>
        )}
        <ResizablePanel defaultSize={60} minSize={60}>
          <div className="border-b">
            <MenuBar />
          </div>
          {children}
        </ResizablePanel>
        {totalPages > 0 && (
          <>
            <ResizableHandle className="hover:bg-primary w-[2px]" withHandle />
            <ResizablePanel defaultSize={20} minSize={20}>
              <ChatBot />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
      {/* <StatusBar /> */}
    </div>
  )
}

export default Layout
