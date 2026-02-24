import PageManipulator from './page-manipulator'
import Pagination from './pagination'

const MenuBar = (): React.JSX.Element => {
  return (
    <div className="h-10 w-full flex justify-between space-x-2 items-center text-sm font-semibold px-2">
      <PageManipulator />
      <div>Untitled.pdf</div>
      <Pagination />
    </div>
  )
}

export default MenuBar
