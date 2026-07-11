'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { 
  Trophy, 
  RefreshCw, 
  ArrowLeft, 
  Users, 
  Loader2,
  Sparkles
} from 'lucide-react'
import * as confetti from 'canvas-confetti'

interface Prediction {
  id: string
  prediction_id: string
  full_name: string
  admission_number: string
  department: string
  year: string
  predicted_country: string
  phone: string
  email: string
  is_locked: boolean
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

// List of World Cup countries
const worldCupCountries = [
  'Argentina', 'Brazil', 'France', 'Germany', 'England', 'Italy', 
  'Spain', 'Portugal', 'Netherlands', 'Belgium', 'Uruguay', 'Croatia',
  'Mexico', 'USA', 'Senegal', 'Morocco', 'Nigeria', 'Ghana'
]

export default function WinnerPicker() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWinner, setSelectedWinner] = useState('')
  const [isPicking, setIsPicking] = useState(false)
  const [winner, setWinner] = useState<Prediction | null>(null)
  const [showWinner, setShowWinner] = useState(false)
  const [error, setError] = useState('')
  const [candidates, setCandidates] = useState<Prediction[]>([])
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
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error:', error)
        return
      }

      setPredictions(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const triggerConfetti = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti.default({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti.default({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  }

  const pickWinner = async () => {
    if (!selectedWinner) {
      setError('Please select a winning country')
      return
    }

    // Find all predictions for the selected country
    const countryPredictions = predictions.filter(
      p => p.predicted_country === selectedWinner
    )

    if (countryPredictions.length === 0) {
      setError(`No predictions for ${selectedWinner}`)
      return
    }

    setCandidates(countryPredictions)
    setIsPicking(true)
    setWinner(null)
    setShowWinner(false)
    setError('')

    // Animate selection (simulate random picking)
    let counter = 0
    const maxCount = 20
    
    // Start confetti during animation
    triggerConfetti()

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * countryPredictions.length)
      const randomPerson = countryPredictions[randomIndex]
      setWinner(randomPerson)
      counter++

      if (counter >= maxCount) {
        clearInterval(interval)
        // Final selection
        const finalIndex = Math.floor(Math.random() * countryPredictions.length)
        const finalWinner = countryPredictions[finalIndex]
        setWinner(finalWinner)
        setShowWinner(true)
        setIsPicking(false)
        
        // Big confetti celebration
        setTimeout(() => {
          triggerConfetti()
          setTimeout(triggerConfetti, 500)
          setTimeout(triggerConfetti, 1000)
        }, 300)
      }
    }, 150)
  }

  const resetPicker = () => {
    setWinner(null)
    setShowWinner(false)
    setSelectedWinner('')
    setCandidates([])
    setError('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-black">
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            Random Winner Picker
          </h1>
          <div className="flex gap-3">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-400 mb-6">
            ❌ {error}
          </div>
        )}

        {/* Statistics */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Predictions</p>
              <p className="text-2xl font-bold text-white">{predictions.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Countries</p>
              <p className="text-2xl font-bold text-white">{worldCupCountries.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Candidates</p>
              <p className="text-2xl font-bold text-yellow-400">{candidates.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-2xl font-bold text-white">
                {showWinner ? '🎉 Winner Chosen!' : 'Ready'}
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Select Winner */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Step 1: Select the Actual World Cup Winner
          </h2>
          <select
            value={selectedWinner}
            onChange={(e) => setSelectedWinner(e.target.value)}
            disabled={isPicking || showWinner}
            className="w-full p-3 bg-black/50 border border-white/10 rounded-lg text-white focus:border-yellow-400 transition-colors"
          >
            <option value="">Select winning country...</option>
            {worldCupCountries.map(country => (
              <option key={country} value={country}>
                {countryFlags[country] || '🏆'} {country}
              </option>
            ))}
          </select>

          {selectedWinner && (
            <div className="mt-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                {predictions.filter(p => p.predicted_country === selectedWinner).length} students predicted {selectedWinner}
              </p>
            </div>
          )}

          <button
            onClick={pickWinner}
            disabled={!selectedWinner || isPicking || showWinner}
            className={`w-full mt-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2
              ${!selectedWinner || isPicking || showWinner 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }`}
          >
            {isPicking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Picking...
              </>
            ) : showWinner ? (
              <>
                <Trophy className="h-5 w-5" />
                Winner Already Chosen
              </>
            ) : (
              <>
                <Trophy className="h-5 w-5" />
                Pick Random Winner
              </>
            )}
          </button>
        </div>

        {/* Winner Display */}
        {showWinner && winner && (
          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl p-8 border-2 border-yellow-400/50 text-center animate-pulse">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">
              Winner!
            </h2>
            <div className="text-5xl mb-2">{countryFlags[winner.predicted_country] || '🏆'}</div>
            <p className="text-2xl font-bold text-white mb-2">{winner.full_name}</p>
            <p className="text-gray-300">Predicted: {winner.predicted_country}</p>
            <p className="text-gray-400 text-sm mt-2">
              Admission: {winner.admission_number} | {winner.department}, {winner.year}
            </p>
            
            <button
              onClick={resetPicker}
              className="mt-6 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Pick Another Winner
            </button>
          </div>
        )}

        {/* Candidates List */}
        {candidates.length > 0 && !showWinner && (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-400" />
              Candidates ({candidates.length})
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {candidates.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{countryFlags[p.predicted_country] || '🏆'}</span>
                    <span className="text-white">{p.full_name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{p.admission_number}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}