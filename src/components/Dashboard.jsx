import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import AddPet from './AddPet'
import PetProfile from './PetProfile'

export default function Dashboard({ session }) {
  const [pets, setPets] = useState([])
  const [showAddPet, setShowAddPet] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState(null)

  const fetchPets = async () => {
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', session.user.id)
    setPets(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPets() }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // If a pet is selected, show its profile instead of the dashboard
  if (selectedPet) {
    return <PetProfile pet={selectedPet} session={session} onBack={() => setSelectedPet(null)} />
  }

  return (
    <div className="min-h-screen bg-teal-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700">🐾 Petfolio</h1>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-gray-600">
            Sign out
          </button>
        </div>

        {/* Pets list */}
        {loading ? (
          <p className="text-gray-400">Loading your pets...</p>
        ) : pets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-4xl mb-3">🐾</p>
            <p className="text-gray-500">No pets yet — add your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pets.map(pet => (
              <div
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
              >
                <div className="text-4xl">{pet.species === 'dog' ? '🐶' : '🐱'}</div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{pet.name}</h2>
                  <p className="text-gray-400 text-sm">{pet.breed || 'Breed not specified'}</p>
                </div>
                <div className="ml-auto text-gray-300">→</div>
              </div>
            ))}
          </div>
        )}

        {/* Add Pet */}
        {showAddPet ? (
          <AddPet session={session} onPetAdded={() => { fetchPets(); setShowAddPet(false) }} />
        ) : (
          <button
            onClick={() => setShowAddPet(true)}
            className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition"
          >
            + Add a Pet
          </button>
        )}

      </div>
    </div>
  )
}