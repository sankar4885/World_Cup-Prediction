'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Check } from 'lucide-react'

function SuccessContent() {
  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchPrediction = async () => {
      if (id) {
        try {
          const { data } = await supabase
            .from('predictions')
            .select('*')
            .eq('prediction_id', id)
            .single()
          
          if (data) setPrediction(data)
        } catch (error) {
          console.error('Error fetching prediction:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading your prediction...</p>
        </div>
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Prediction Not Found</h1>
          <p className="text-gray-400">We couldn't find your prediction.</p>
          <Link href="/" className="mt-6 inline-block text-yellow-400 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-black">
      <div className="container max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
          <Check className="h-10 w-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">
          Prediction Submitted! 🎉
        </h1>
        
        <p className="text-gray-300 mb-8">
          Your prediction has been recorded successfully.
        </p>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Prediction ID</span>
            <span className="text-yellow-400">{prediction.prediction_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span className="text-white">{prediction.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Admission Number</span>
            <span className="text-white">{prediction.admission_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Department</span>
            <span className="text-white">{prediction.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Year</span>
            <span className="text-white">{prediction.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Predicted Champion</span>
            <span className="text-yellow-400 font-bold">{prediction.predicted_country}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}