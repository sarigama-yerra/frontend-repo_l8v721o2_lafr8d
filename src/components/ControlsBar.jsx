import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Mail } from 'lucide-react'

export default function ControlsBar({ disabled, onGenerate, onEmail }) {
  const [format, setFormat] = useState('xlsx')
  const canClick = !disabled

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Export as</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="pdf">PDF (.pdf)</option>
          <option value="json">JSON (preview)</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button disabled={!canClick} onClick={() => onGenerate(format)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-40">
          <Download className="w-4 h-4" /> Generate
        </button>
        <button disabled={!canClick} onClick={() => onEmail(format)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-40">
          <Mail className="w-4 h-4" /> Send Email
        </button>
      </div>
    </div>
  )
}
