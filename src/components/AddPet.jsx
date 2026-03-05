import { useState } from 'react'
import { supabase } from '../supabase'

export default function AddPet({ session, onPetAdded }) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('dog')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [weight, setWeight] = useState('')
  const [isSpayedNeutered, setIsSpayedNeutered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!name) { setMessage('Please enter a name!'); return }
    setLoading(true)

    const { error } = await supabase.from('pets').insert({
      user_id: session.user.id,
      name,
      species,
      breed,
      birth_date: birthDate || null,
      weight: weight || null,
      is_spayed_neutered: isSpayedNeutered,
    })

    if (error) {
      setMessage(error.message)
    } else {
      onPetAdded()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold text-teal-700 mb-4">Add a Pet</h2>

      <div className="space-y-4">

        {/* Species toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setSpecies('dog')}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${species === 'dog' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            🐶 Dog
          </button>
          <button
            onClick={() => setSpecies('cat')}
            className={`flex-1 py-2 rounded-xl font-semibold transition ${species === 'cat' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            🐱 Cat
          </button>
        </div>

        <input
          type="text"
          placeholder="Pet's name *"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        <input
          type="text"
          placeholder="Breed"
          value={breed}
          onChange={e => setBreed(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        <div className="flex gap-3">
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="number"
            placeholder="Weight (lbs)"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSpayedNeutered}
            onChange={e => setIsSpayedNeutered(e.target.checked)}
            className="w-5 h-5 accent-teal-600"
          />
          <span className="text-gray-600">Spayed / Neutered</span>
        </label>

        {message && <p className="text-sm text-red-500">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition"
        >
          {loading ? 'Saving...' : 'Save Pet'}
        </button>

      </div>
    </div>
  )
}