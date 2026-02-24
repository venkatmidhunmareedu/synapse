const EmptyState = ({ icon, desc }: { icon: React.ReactNode; desc: string }): React.JSX.Element => {
  return (
    <div className="flex w-full h-full items-center justify-center pointer-events-none select-none">
      <div className="flex flex-col items-center text-center border border-dashed rounded-lg p-4 gap-2">
        <div className="flex">{icon}</div>
        <p className="text-muted-foreground text-xs">{desc}</p>
      </div>
    </div>
  )
}
export default EmptyState
