'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, X, User, Users } from 'lucide-react'

// List of 48 teams for the 2026 FIFA World Cup with flags
const countries = [
  // CONCACAF (6)
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CW', name: 'Curacao', flag: '🇨🇼' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦' },

  // AFC (9)
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'JO', name: 'Jorden', flag: '🇯🇴' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },

  // CAF (10)
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: 'CD', name: 'Congo DR', flag: '🇨🇩' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'CI', name: 'Cote d Ivoire', flag: '🇨🇮' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },

  // CONMEBOL (6)
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },

  // OFC (1)
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },

  // UEFA (16)
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿' },
  { code: 'GB-ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'TR', name: 'Turkiye', flag: '🇹🇷' },
]

export default function PredictPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0] | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: '',
    userType: 'Student',
    department: '',
    year: '',
    phone: '',
    email: '',
    predictedCountry: '',
    termsAccepted: false
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter countries based on search
  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.flag.includes(searchTerm) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectCountry = (country: typeof countries[0]) => {
    setSelectedCountry(country)
    setFormData({...formData, predictedCountry: country.name})
    setSearchTerm(country.name)
    setShowDropdown(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setFormData({...formData, predictedCountry: value})
    
    const match = countries.find(c => 
      c.name.toLowerCase() === value.toLowerCase() ||
      c.name.toLowerCase().includes(value.toLowerCase())
    )
    if (match) {
      setSelectedCountry(match)
    } else {
      setSelectedCountry(null)
    }
    
    if (value.length > 0) {
      setShowDropdown(true)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedCountry(null)
    setFormData({...formData, predictedCountry: ''})
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if submissions are still open
    const targetDate = new Date('2026-07-13T18:00:00')
    const now = new Date()
    if (now > targetDate) {
      setError('Submissions are now closed. The prediction period has ended.')
      return
    }
    
    console.log('Form submitted!')
    
    // Validate required fields based on user type
    if (!formData.fullName || !formData.department || 
        !formData.year || !formData.predictedCountry || !formData.termsAccepted) {
      setError('Please fill in all required fields and accept the terms.')
      return
    }

    // For students, admission number is required
    if (formData.userType === 'Student' && !formData.admissionNumber) {
      setError('Admission number is required for students.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const predId = `WC${Date.now()}`.slice(0, 20)
      console.log('Prediction ID:', predId)
      console.log('Form data:', formData)
      
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          prediction_id: predId,
          full_name: formData.fullName,
          admission_number: formData.admissionNumber || null,
          user_type: formData.userType,
          department: formData.department,
          year: formData.year,
          phone: formData.phone || null,
          email: formData.email || null,
          predicted_country: formData.predictedCountry,
          terms_accepted: formData.termsAccepted
        })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        setError(`Database error: ${error.message}`)
        setLoading(false)
        return
      }

      console.log('Success! Data:', data)
      setSuccess(true)
      
      router.push(`/success?id=${predId}`)
      
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-black">
      <div className="container max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-yellow-400 mb-8">Make Your Prediction</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-400 mb-6">
            ❌ Error: {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 p-4 rounded-lg text-green-400 mb-6">
            ✅ Submitted successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name *"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          {/* User Type - Student or Faculty */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              I am a... *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'Student'})}
                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.userType === 'Student'
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <Users className="h-5 w-5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, userType: 'Faculty'})}
                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.userType === 'Faculty'
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                }`}
              >
                <User className="h-5 w-5" />
                Faculty
              </button>
            </div>
          </div>

          {/* Admission Number - Only for Students */}
          {formData.userType === 'Student' && (
            <div>
              <input
                type="text"
                placeholder="Admission Number *"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
                value={formData.admissionNumber}
                onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})}
                required
              />
            </div>
          )}

          {/* For Faculty - Show a note instead of admission number */}
          {formData.userType === 'Faculty' && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-300 text-sm">
              <p>📋 Faculty members - please fill in your details below</p>
            </div>
          )}

          <div>
            <select
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-yellow-400 transition-colors"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
              style={{ color: 'white' }}
            >
              <option value="" style={{ color: '#666', backgroundColor: '#1a1a1a' }}>Select Department *</option>
              <option value="CSE" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>CSE</option>
              <option value="EC" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>EC</option>
              <option value="AD" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>AD</option>
              <option value="MECH" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>MECH</option>
              <option value="BVOC" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>BVOC</option>
              <option value="BCA" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>BCA</option>
            </select>
          </div>

          <div>
            <select
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-yellow-400 transition-colors"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              required
              style={{ color: 'white' }}
            >
              <option value="" style={{ color: '#666', backgroundColor: '#1a1a1a' }}>Select Year *</option>
              {formData.userType === 'Student' ? (
                <>
                  <option value="1st Year" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>1st Year</option>
                  <option value="2nd Year" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>2nd Year</option>
                  <option value="3rd Year" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>3rd Year</option>
                  <option value="4th Year" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>4th Year</option>
                </>
              ) : (
                <option value="Faculty" style={{ color: 'white', backgroundColor: '#1a1a1a' }}>Faculty</option>
              )}
            </select>
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email (optional)"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Country Selector with Search */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Your Champion *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                {selectedCountry ? selectedCountry.flag : '🌍'}
              </div>
              <input
                type="text"
                placeholder="Type or select a country..."
                className="w-full pl-12 pr-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-yellow-400 transition-colors"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-hidden">
                <div className="p-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">{filteredCountries.length} countries found</span>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-48">
                  {filteredCountries.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No countries found
                    </div>
                  ) : (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleSelectCountry(country)}
                        className={`w-full px-4 py-2.5 hover:bg-white/10 transition-colors flex items-center gap-3 text-left ${
                          selectedCountry?.code === country.code ? 'bg-yellow-400/10' : ''
                        }`}
                      >
                        <span className="text-2xl">{country.flag}</span>
                        <span className="text-white">{country.name}</span>
                        <span className="text-gray-500 text-sm ml-auto">{country.code}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
              required
              className="w-4 h-4 accent-yellow-400"
            />
            <label className="text-sm text-gray-300">I accept the terms and conditions *</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors text-lg"
          >
            {loading ? 'Submitting...' : 'Submit Prediction 🏆'}
          </button>
        </form>
      </div>
    </main>
  )
}