import { useMemo, useState } from 'react'
import FileUploader from './components/FileUploader'
import ControlsBar from './components/ControlsBar'
import InsightsDashboard from './components/InsightsDashboard'
import PreviewTable from './components/PreviewTable'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [files, setFiles] = useState({})
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState(false)
  const hasAll = files.shipment_history && files.edib2bi && files.edi940

  const handleGenerate = async (format) => {
    if (!hasAll) return
    setBusy(true)
    try {
      const form = new FormData()
      form.append('shipment_history', files.shipment_history)
      form.append('edib2bi', files.edib2bi)
      form.append('edi940', files.edi940)
      form.append('format', format)

      const res = await fetch(`${API_BASE}/reconcile`, { method: 'POST', body: form })

      if (format === 'json') {
        const json = await res.json()
        setRows(json.rows || [])
      } else {
        // Stream a file download
        const blob = await res.blob()
        const cd = res.headers.get('Content-Disposition') || 'attachment; filename="report"'
        const filename = cd.split('filename=')[1]?.replace(/"/g, '') || `report.${format}`
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)

        // Also fetch JSON to power dashboard
        const formPreview = new FormData()
        formPreview.append('shipment_history', files.shipment_history)
        formPreview.append('edib2bi', files.edib2bi)
        formPreview.append('edi940', files.edi940)
        formPreview.append('format', 'json')
        const resPreview = await fetch(`${API_BASE}/reconcile`, { method: 'POST', body: formPreview })
        const json = await resPreview.json()
        setRows(json.rows || [])
      }
    } catch (e) {
      console.error(e)
      alert('Generation failed. Please verify files and try again.')
    } finally {
      setBusy(false)
    }
  }

  const handleEmail = async (format) => {
    if (!hasAll) return
    const to = prompt('Enter recipient emails separated by commas:')
    if (!to) return

    setBusy(true)
    try {
      const form = new FormData()
      form.append('shipment_history', files.shipment_history)
      form.append('edib2bi', files.edib2bi)
      form.append('edi940', files.edi940)
      form.append('to', to)
      form.append('format', format)

      const res = await fetch(`${API_BASE}/send-report`, { method: 'POST', body: form })
      const json = await res.json()
      if (res.ok) {
        alert(`Email sent to ${json.recipients.join(', ')}`)
      } else {
        throw new Error(json.detail || 'Email failed')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to send email. Ensure SMTP settings are configured on the server.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Missing 945 Reconciliation</h1>
            <p className="text-gray-600">Upload three inputs, generate output, explore insights, and share the report.</p>
          </div>
        </header>

        <FileUploader onFilesChange={setFiles} />
        <ControlsBar disabled={!hasAll || busy} onGenerate={handleGenerate} onEmail={handleEmail} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InsightsDashboard rows={rows} />
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white/70 backdrop-blur p-4">
              <h3 className="font-semibold mb-3">Preview</h3>
              <PreviewTable rows={rows} max={25} />
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-500 pt-8">
          Built for a modern, intuitive, and visually stunning workflow.
        </footer>
      </div>
    </div>
  )
}
