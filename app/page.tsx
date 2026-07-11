import Link from 'next/link'
import { Trophy, Users, Flag, Zap, Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Admin Login Button - Top Right Corner */}
          <div className="flex justify-end mb-8">
            <Link 
              href="/admin/login"
              className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 text-sm"
            >
              <Shield className="h-4 w-4" />
              Admin Login
            </Link>
          </div>

          <h1 className="text-5xl font-bold text-yellow-400 mb-6">
            🏆 Predict the World Cup Champion
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Join students in predicting who will lift the trophy!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/predict"
              className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all hover:scale-105"
            >
              Make Your Prediction 🎯
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all hover:scale-105"
            >
              View Dashboard 📊
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-yellow-400/30 transition-all">
              <Users className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Predictions</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-yellow-400/30 transition-all">
              <Flag className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">32</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-yellow-400/30 transition-all">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1</div>
              <div className="text-sm text-gray-400">Champion</div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-yellow-400/30 transition-all">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">Live</div>
              <div className="text-sm text-gray-400">Updates</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 text-sm text-gray-600">
            <p>🏆 World Cup Prediction Challenge 2026</p>
            <p className="mt-1">Made with ❤️ for college students</p>
          </div>
        </div>
      </div>
    </main>
  )
}