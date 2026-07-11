'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { 
  Users, 
  Search, 
  Download, 
  Lock, 
  Unlock, 
  Trash2,
  LogOut,
  ArrowLeft,
  Trophy
} from 'lucide-react'
import * as XLSX from 'xlsx'

interface Prediction {
  id: string
  prediction_id: string
  full_name: string
  admission_number: string
  department: string
  year: string
  phone: string
  email: string
  predicted_country: string
  created_at: string
  is_locked: boolean
}

export default function AdminDashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn')
    if (!isLoggedIn) {
      router.push('/admin/login')
      return
    }
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Fetching predictions...')
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError(`Database error: ${error.message}`)
        return
      }

      console.log('Data received:', data)
      setPredictions(data || [])
      setFilteredPredictions(data || [])
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Failed to load predictions')
    } finally {
      setLoading(false)
    }
  }

  // Filter predictions
  useEffect(() => {
    let filtered = predictions

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.admission_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.prediction_id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (departmentFilter) {
      filtered = filtered.filter(p => p.department === departmentFilter)
    }

    if (yearFilter) {
      filtered = filtered.filter(p => p.year === yearFilter)
    }

    setFilteredPredictions(filtered)
  }, [searchTerm, departmentFilter, yearFilter, predictions])

  // Get unique departments and years for filters
  const departments = [...new Set(predictions.map(p => p.department))].sort()
  const years = [...new Set(predictions.map(p => p.year))].sort()

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredPredictions.map(p => ({
      'Prediction ID': p.prediction_id || 'N/A',
      'Full Name': p.full_name || 'N/A',
      'Admission Number': p.admission_number || 'N/A',
      'Department': p.department || 'N/A',
      'Year': p.year || 'N/A',
      'Phone': p.phone || 'N/A',
      'Email': p.email || 'N/A',
      'Predicted Country': p.predicted_country || 'N/A',
      'Submitted': p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A',
      'Locked': p.is_locked ? 'Yes' : 'No'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Predictions')
    XLSX.writeFile(wb, `predictions-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Delete prediction
  const deletePrediction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prediction?')) return

    try {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Error deleting prediction')
        return
      }

      setPredictions(predictions.filter(p => p.id !== id))
    } catch (err) {
      alert('Error deleting prediction')
    }
  }

  // Toggle lock
  const toggleLock = async (id: string, currentLock: boolean) => {
    try {
      const { error } = await supabase
        .from('predictions')
        .update({ is_locked: !currentLock })
        .eq('id', id)

      if (error) {
        alert('Error updating lock status')
        return
      }

      setPredictions(predictions.map(p =>
        p.id === id ? { ...p, is_locked: !currentLock } : p
      ))
    } catch (err) {
      alert('Error updating lock status')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl max-w-md w-full">
          <h2 className="text-red-400 font-bold text-lg mb-2">Error Loading Dashboard</h2>
          <p className="text-red-300 text-sm">{error}</p>
          <button
            onClick={fetchPredictions}
            className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-black">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">🔐 Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage all predictions</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Pick Winner Button - THIS IS THE FIX */}
            <Link 
              href="/admin/winner" 
              className="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-colors flex items-center gap-2 border border-yellow-400/30"
            >
              <Trophy className="h-4 w-4" />
              🏆 Pick Winner
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <Link href="/" className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{predictions.length}</div>
            <div className="text-sm text-gray-400">Total Predictions</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">{filteredPredictions.length}</div>
            <div className="text-sm text-gray-400">Filtered Results</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {predictions.filter(p => p.is_locked).length}
            </div>
            <div className="text-sm text-gray-400">Locked</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">
              {predictions.filter(p => !p.is_locked).length}
            </div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Name, Admission, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 p-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-yellow-400 transition-colors"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full p-2 bg-black/50 border border-white/10 rounded-lg text-white focus:border-yellow-400 transition-colors"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={exportToExcel}
                className="w-full p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">ID</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Admission</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Department</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Year</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Country</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPredictions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      {predictions.length === 0 ? 'No predictions yet. Students need to submit predictions!' : 'No matches found'}
                    </td>
                  </tr>
                ) : (
                  filteredPredictions.map((p) => (
                    <tr key={p.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-400">{p.prediction_id}</td>
                      <td className="px-4 py-3 text-sm text-white">{p.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.admission_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.year}</td>
                      <td className="px-4 py-3 text-sm text-yellow-400">{p.predicted_country}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          p.is_locked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {p.is_locked ? 'Locked' : 'Unlocked'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleLock(p.id, p.is_locked)}
                            className={`p-1 rounded hover:bg-white/10 transition-colors ${
                              p.is_locked ? 'text-green-400' : 'text-yellow-400'
                            }`}
                            title={p.is_locked ? 'Unlock' : 'Lock'}
                          >
                            {p.is_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => deletePrediction(p.id)}
                            className="p-1 rounded hover:bg-white/10 transition-colors text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}