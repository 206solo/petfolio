import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center">
      <p className="text-teal-700 text-lg">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-teal-50">
      {session ? <Dashboard session={session} /> : <Auth />}
    </div>
  )
}

export default App