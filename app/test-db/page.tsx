'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestDB() {
  const [status, setStatus] = useState('Ready')
  const [errorMsg, setErrorMsg] = useState('')

  const testConnection = async () => {
    setStatus('Testing...')
    setErrorMsg('')
    
    try {
      console.log('Testing Supabase connection...')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      // Try to fetch one record
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .limit(1)

      if (error) {
        console.error('Error:', error)
        setStatus('❌ Failed')
        setErrorMsg(error.message)
      } else {
        console.log('Success:', data)
        setStatus('✅ Connected!')
        setErrorMsg(`Found ${data.length} records`)
      }
    } catch (err: any) {
      console.error('Exception:', err)
      setStatus('❌ Failed')
      setErrorMsg(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-white/5 rounded-xl p-8 border border-white/10 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Database Test</h1>
        <button
          onClick={testConnection}
          className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
        >
          Test Connection
        </button>
        <div className="mt-4 p-4 bg-black/50 rounded-lg">
          <p className="text-sm text-gray-400">Status:</p>
          <p className="text-white text-sm mt-1">{status}</p>
          {errorMsg && (
            <>
              <p className="text-sm text-gray-400 mt-2">Message:</p>
              <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
            </>
          )}
        </div>
        <div className="mt-4 p-4 bg-black/50 rounded-lg">
          <p className="text-sm text-gray-400">URL:</p>
          <p className="text-xs text-gray-500 break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        </div>
      </div>
    </div>
  )
}