import { useState } from 'react'
import DietTab from './DietTab'
import HealthTab from './HealthTab'

export default function PetProfile({ pet, session, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = ['overview', 'diet', 'health']

  return (
    <div className="min-h-screen bg-teal-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button onClick={onBack} className="text-teal-600 font-semibold mb-4 hover:underline">
          ← Back
        </button>

        {/* Pet header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 flex items-center gap-4">
          <div className="text-5xl">{pet.species === 'dog' ? '🐶' : '🐱'}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{pet.name}</h1>
            <p className="text-gray-400">{pet.breed || 'Breed not specified'} · {pet.weight ? `${pet.weight} lbs` : 'Weight not set'}</p>
            {pet.is_spayed_neutered && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full mt-1 inline-block">Spayed/Neutered</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-sm p-1 mb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition ${
                activeTab === tab ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
            <h2 className="font-bold text-gray-700">Pet Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Species</span><p className="font-medium capitalize">{pet.species}</p></div>
              <div><span className="text-gray-400">Breed</span><p className="font-medium">{pet.breed || '—'}</p></div>
              <div><span className="text-gray-400">Birthday</span><p className="font-medium">{pet.birth_date || '—'}</p></div>
              <div><span className="text-gray-400">Weight</span><p className="font-medium">{pet.weight ? `${pet.weight} lbs` : '—'}</p></div>
              <div><span className="text-gray-400">Microchip</span><p className="font-medium">{pet.microchip || '—'}</p></div>
              <div><span className="text-gray-400">Insurance</span><p className="font-medium">{pet.insurer || '—'}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'diet' && <DietTab pet={pet} session={session} />}

        {activeTab === 'health' && <HealthTab pet={pet} session={session} />}

      </div>
    </div>
  )
}