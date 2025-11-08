export default function PreviewTable({ rows, max = 50 }) {
  if (!rows || rows.length === 0) return null
  const cols = Object.keys(rows[0] || {})
  const data = rows.slice(0, max)

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-auto shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {cols.map((c) => (
              <th key={c} className="text-left px-3 py-2 font-medium text-gray-700 whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 whitespace-nowrap text-gray-800">{String(r[c] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
