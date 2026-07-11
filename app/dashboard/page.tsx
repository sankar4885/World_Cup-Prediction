'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts'
import { Users, Flag, Trophy, Clock } from 'lucide-react'

interface Prediction {
  id: string
  prediction_id: string
  full_name: string
  admission_number: string
  department: string
  year: string
  predicted_country: string
  created_at: string
}

// Country flag mapping
const countryFlags: { [key: string]: string } = {
  'Argentina': '🇦🇷',
  'Brazil': '🇧🇷',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Uruguay': '🇺🇾',
  'Croatia': '🇭🇷',
  'Mexico': '🇲🇽',
  'USA': '🇺🇸',
  'Senegal': '🇸🇳',
  'Morocco': '🇲🇦',
  'Nigeria': '🇳🇬',
  'Ghana': '🇬🇭',
}

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE']

export default function DashboardPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPredictions, setTotalPredictions] = useState(0)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching predictions:', error)
        return
      }

      setPredictions(data || [])
      setTotalPredictions(data?.length || 0)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate votes per country
  const getVotesPerCountry = () => {
    const votes: { [key: string]: number } = {}
    predictions.forEach(p => {
      const country = p.predicted_country
      votes[country] = (votes[country] || 0) + 1
    })
    return Object.entries(votes)
      .map(([name, value]) => ({ name, value, flag: countryFlags[name] || '🏆' }))
      .sort((a, b) => b.value - a.value)
  }

  // Get top countries for bar chart
  const getTopCountries = () => {
    return getVotesPerCountry().slice(0, 10)
  }

  // Get recent predictions (without personal info)
  const getRecentPredictions = () => {
    return predictions.slice(0, 5).map(p => ({
      id: p.id,
      country: p.predicted_country,
      flag: countryFlags[p.predicted_country] || '🏆',
      time: new Date(p.created_at).toLocaleDateString()
    }))
  }

  const votesData = getVotesPerCountry()
  const topCountries = getTopCountries()
  const recentPredictions = getRecentPredictions()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">🏆 World Cup Dashboard</h1>
            <p className="text-gray-400 mt-1">Live prediction statistics</p>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Users className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{totalPredictions}</div>
            <div className="text-sm text-gray-400">Total Predictions</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Flag className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{votesData.length}</div>
            <div className="text-sm text-gray-400">Countries Voted</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {votesData.length > 0 ? votesData[0].name : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Current Leader</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {predictions.length > 0 ? new Date(predictions[0].created_at).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Latest Prediction</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Votes Distribution</h2>
            {votesData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No votes yet. Be the first to predict!</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={votesData.slice(0, 8)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {votesData.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4">Top 10 Countries</h2>
            {topCountries.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No votes yet. Be the first to predict!</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCountries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#FFD700">
                      {topCountries.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">Recent Predictions</h2>
          {recentPredictions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No predictions yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {recentPredictions.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.flag}</span>
                    <span className="text-white">{p.country}</span>
                  </div>
                  <span className="text-sm text-gray-400">{p.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}