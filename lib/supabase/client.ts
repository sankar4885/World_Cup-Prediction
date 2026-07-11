import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcmulqnkcacnuytexbls.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbXVscW5rY2FjbnV5dGV4YmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMDM5MDcsImV4cCI6MjA5ODU3OTkwN30.tOfVip7-brG0rFpglN5IkCbv8LQXCzZmMw6uym7FBkI'

export const supabase = createClient(supabaseUrl, supabaseKey)