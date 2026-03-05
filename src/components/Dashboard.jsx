import { supabase } from '../supabase'

export default function Dashboard({ session }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-teal-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">🐾 Petfolio</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
        <p className="text-gray-600">Welcome, {session.user.email}!</p>
        <p className="text-gray-400 text-sm mt-2">Your dashboard is coming soon...</p>
      </div>
    </div>
  )
}