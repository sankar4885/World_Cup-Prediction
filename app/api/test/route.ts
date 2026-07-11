import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
    supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set'
  })
}