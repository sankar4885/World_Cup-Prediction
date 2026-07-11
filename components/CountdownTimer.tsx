'use client'

import { useEffect, useState } from 'react'
import { Clock, Calendar, AlertCircle } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Target date: Monday, July 13, 2026 at 6:00 PM
    const targetDate = new Date('2026-07-13T18:00:00')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
        clearInterval(timer)
        return
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const TimeUnit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-b from-yellow-400/20 to-transparent rounded-xl p-3 md:p-4 min-w-[60px] md:min-w-[80px] border border-yellow-400/20">
        <span className="text-2xl md:text-4xl font-bold text-yellow-400">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs uppercase mt-2 text-gray-400">{label}</span>
    </div>
  )

  if (!isClient) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-yellow-400/20 text-center">
        <div className="text-gray-400">Loading timer...</div>
      </div>
    )
  }

  if (timeLeft.isExpired) {
    return (
      <div className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <span className="text-2xl font-bold text-red-400">Submissions Closed</span>
        </div>
        <p className="text-gray-300">
          The prediction period has ended. Thank you for participating!
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Check back for the winner announcement!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-yellow-400/20">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Monday, July 13, 2026 - 6:00 PM</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <Clock className="h-5 w-5" />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-2xl md:text-4xl font-bold text-yellow-400/50">:</span>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <span className="text-2xl md:text-4xl font-bold text-yellow-400/50">:</span>
        <TimeUnit value={timeLeft.minutes} label="Mins" />
        <span className="text-2xl md:text-4xl font-bold text-yellow-400/50">:</span>
        <TimeUnit value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  )
}