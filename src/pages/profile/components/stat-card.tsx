import { type ReactElement } from "react"

interface StatCardProps {
  icon: ReactElement
  value: string
  label: string
}

const StatCard = ({ icon, value, label }: StatCardProps) => {
  return (
    <div className="bg-black p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-transparent hover:border-white/5 hover:bg-[#161616] transition-all group shadow-sm">
      <div className="text-white text-3xl mb-1 opacity-90 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-2xl sm:text-3xl font-bold text-white">{value}</span>
      <span className="text-[9px] uppercase tracking-[0.1em] text-gray-500 font-bold leading-tight">
        {label}
      </span>
    </div>
  )
}

export default StatCard
