import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu'

type Props = {
  label: string
  action: () => void
  shortcut?: string
  enabled: boolean
}

const Option = ({ label, action, shortcut, enabled }: Props): React.JSX.Element => {
  return (
    <DropdownMenuItem onClick={action} disabled={!enabled} className="w-full">
      <span className="word-break-all">{label}</span>
      <DropdownMenuShortcut className="">{shortcut}</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}

export default Option
