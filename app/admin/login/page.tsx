'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple password check (you can change this)
    const adminPassword = 'admin123' // Change this to your password

    if (password === adminPassword) {
      // Store login in session
      sessionStorage.setItem('adminLoggedIn', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">🔐 Admin Login</h1>
          <p className="text-gray-400 text-sm">Enter the admin password to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-3 rounded-lg text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}