import MenuBar from './menu-bar'
import SideBar from './side-bar'
import StatusBar from './status-bar'
import TitleBar from './title-bar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

const Layout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <div className="flex flex-col h-screen w-screen">
      <TitleBar />
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={20} minSize={20}>
          <SideBar />
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary w-1" />
        <ResizablePanel defaultSize={80} minSize={60}>
          <MenuBar />
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
      <StatusBar />
    </div>
  )
}

export default Layout
