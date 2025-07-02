import { ReactNode } from 'react'

const StatsCard = ({
  title,
  children,
  value,
}: {
  title: string
  children?: ReactNode
  value?: ReactNode
}) => (
  <div className="rounded-xl bg-slate-800/50 p-4 shadow ring-1 ring-white/10">
    <h3 className="mb-2 text-sm font-semibold text-slate-300">{title}</h3>
    {value ?? children}
  </div>
)
export default StatsCard
