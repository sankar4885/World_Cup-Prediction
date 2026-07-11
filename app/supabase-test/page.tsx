'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function SupabaseTest() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      console.log('Testing connection...')
      
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('Error:', error)
        setResult(`❌ Error: ${error.message} (code: ${error.code})`)
      } else {
        console.log('Success:', data)
        setResult(`✅ Connected! Found ${data.length} records`)
      }
    } catch (err: any) {
      console.error('Exception:', err)
      setResult(`❌ Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testInsert = async () => {
    setLoading(true)
    setResult('Testing insert...')
    
    try {
      const testId = `TEST-${Date.now()}`
      console.log('Inserting test record...')
      
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          prediction_id: testId,
          full_name: 'Test User',
          admission_number: `ADM${Date.now()}`,
          department: 'CSE',
          year: '1st Year',
          predicted_country: 'BR',
          terms_accepted: true
        })
        .select()
      
      if (error) {
        console.error('Insert error:', error)
        setResult(`❌ Insert failed: ${error.message}`)
      } else {
        console.log('Insert success:', data)
        setResult(`✅ Insert successful! ID: ${testId}`)
      }
    } catch (err: any) {
      console.error('Exception:', err)
      setResult(`❌ Exception: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-white/5 rounded-xl p-8 border border-white/10 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={testConnection}
              disabled={loading}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              Test Connection
            </button>
            <button
              onClick={testInsert}
              disabled={loading}
              className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              Test Insert
            </button>
          </div>
          
          <div className="p-4 bg-black/50 rounded-lg">
            <p className="text-sm text-gray-400">Status:</p>
            <p className="text-white text-sm mt-1 whitespace-pre-wrap break-all">{result || 'Ready to test'}</p>
          </div>
          
          <div className="p-4 bg-black/50 rounded-lg">
            <p className="text-sm text-gray-400">Environment Variables:</p>
            <p className="text-xs text-gray-500 mt-1">
              URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
            </p>
            <p className="text-xs text-gray-500">
              Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}