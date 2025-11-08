import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart2, TrendingUp } from 'lucide-react'

export default function InsightsDashboard({ rows }) {
  const stats = useMemo(() => {
    if (!rows || rows.length === 0) return null
    const total = rows.length
    const byState = {}
    const byStatus = {}
    let units = 0

    for (const r of rows) {
      const st = r['Ship State'] || r['ShipState'] || 'Unknown'
      byState[st] = (byState[st] || 0) + 1
      const status = r['EDI Processing Status'] || r['StatusSummary'] || 'Unknown'
      byStatus[status] = (byStatus[status] || 0) + 1
      units += Number(r['Units']) || 0
    }

    const topStates = Object.entries(byState).sort((a,b)=>b[1]-a[1]).slice(0,6)
    const topStatus = Object.entries(byStatus).sort((a,b)=>b[1]-a[1]).slice(0,5)

    return { total, units, topStates, topStatus }
  }, [rows])

  if (!stats) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-6 text-gray-500">
        Upload files and generate to see insights.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="text-xs uppercase text-gray-500">Total Records</div>
          <div className="text-3xl font-semibold mt-1">{stats.total.toLocaleString()}</div>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="text-xs uppercase text-gray-500">Total Units</div>
          <div className="text-3xl font-semibold mt-1">{stats.units.toLocaleString()}</div>
        </div>
        <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="text-xs uppercase text-gray-500">Distinct States</div>
          <div className="text-3xl font-semibold mt-1">{(stats.topStates?.length || 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold">Top States</h3>
          </div>
          <div className="space-y-2">
            {stats.topStates.map(([st, count]) => (
              <div key={st} className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{st}</div>
                <div className="text-sm font-medium">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="font-semibold">Processing Status</h3>
          </div>
          <div className="space-y-2">
            {stats.topStatus.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{name}</div>
                <div className="text-sm font-medium">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
