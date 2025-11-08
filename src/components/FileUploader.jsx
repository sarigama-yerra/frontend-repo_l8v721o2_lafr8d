import { useState } from 'react'
import { Upload } from 'lucide-react'

export default function FileUploader({ onFilesChange }) {
  const [files, setFiles] = useState({ shipment_history: null, edib2bi: null, edi940: null })

  const handleChange = (key, f) => {
    const next = { ...files, [key]: f?.[0] ?? null }
    setFiles(next)
    onFilesChange?.(next)
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Input Files</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col gap-2 p-4 rounded-lg border border-dashed border-gray-300 hover:border-indigo-400 transition cursor-pointer bg-gray-50">
          <span className="text-sm font-medium text-gray-700">Shipment History</span>
          <input type="file" accept=".csv" className="hidden" onChange={(e) => handleChange('shipment_history', e.target.files)} />
          <div className="flex items-center gap-2 text-gray-600">
            <Upload className="w-4 h-4" />
            <span className="text-xs truncate">{files.shipment_history?.name || 'Choose CSV'}</span>
          </div>
        </label>
        <label className="flex flex-col gap-2 p-4 rounded-lg border border-dashed border-gray-300 hover:border-indigo-400 transition cursor-pointer bg-gray-50">
          <span className="text-sm font-medium text-gray-700">EDIB2Bi Report</span>
          <input type="file" accept=".csv" className="hidden" onChange={(e) => handleChange('edib2bi', e.target.files)} />
          <div className="flex items-center gap-2 text-gray-600">
            <Upload className="w-4 h-4" />
            <span className="text-xs truncate">{files.edib2bi?.name || 'Choose CSV'}</span>
          </div>
        </label>
        <label className="flex flex-col gap-2 p-4 rounded-lg border border-dashed border-gray-300 hover:border-indigo-400 transition cursor-pointer bg-gray-50">
          <span className="text-sm font-medium text-gray-700">EDI940 Report</span>
          <input type="file" accept=".csv" className="hidden" onChange={(e) => handleChange('edi940', e.target.files)} />
          <div className="flex items-center gap-2 text-gray-600">
            <Upload className="w-4 h-4" />
            <span className="text-xs truncate">{files.edi940?.name || 'Choose CSV'}</span>
          </div>
        </label>
      </div>
    </div>
  )
}
