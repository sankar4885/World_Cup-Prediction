'use client'

import { useState } from 'react'

export default function SupabaseDirect() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testDirect = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      console.log('🔗 URL:', url)
      console.log('🔑 Key:', key)
      
      // Try a simple health check
      const response = await fetch(url + '/rest/v1/', {
        method: 'GET',
        headers: {
          'apikey': key!,
          'Authorization': 'Bearer ' + key!,
        },
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        setResult('✅ Connected to Supabase!')
      } else {
        const text = await response.text()
        setResult('❌ Status: ' + response.status + ' - ' + text)
      }
    } catch (err: any) {
      console.error('Error:', err)
      setResult('❌ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-white/5 rounded-xl p-8 border border-white/10 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Supabase Test</h1>
        
        <button
          onClick={testDirect}
          disabled={loading}
          className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        
        <div className="mt-4 p-4 bg-black/50 rounded-lg">
          <p className="text-sm text-gray-400">Result:</p>
          <p className="text-white text-sm mt-1 break-all">{result || 'Ready'}</p>
        </div>
        
        <div className="mt-4 p-4 bg-black/50 rounded-lg">
          <p className="text-sm text-gray-400">URL:</p>
          <p className="text-xs text-gray-500 break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        </div>
      </div>
    </div>
  )
}