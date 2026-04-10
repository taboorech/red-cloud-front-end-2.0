const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="p-5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
)

export default StatCard
