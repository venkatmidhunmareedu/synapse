import MenuBar from './menu-bar'
import SideBar from './side-bar'
import StatusBar from './status-bar'
import TitleBar from './title-bar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

const Layout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <TitleBar />
      <ResizablePanelGroup orientation="horizontal" className="overflow-y-auto border-t border-b">
        <ResizablePanel defaultSize={20} minSize={20}>
          <SideBar />
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary w-[2px]" withHandle />
        <ResizablePanel defaultSize={80} minSize={60}>
          <div className="border-b">
            <MenuBar />
          </div>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
      <StatusBar />
    </div>
  )
}

export default Layout
