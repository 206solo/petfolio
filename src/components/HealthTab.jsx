import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function HealthTab({ pet }) {
  const [vet, setVet] = useState(null)
  const [vaccinations, setVaccinations] = useState([])
  const [medications, setMedications] = useState([])
  const [showVetForm, setShowVetForm] = useState(false)
  const [showVaxForm, setShowVaxForm] = useState(false)
  const [showMedForm, setShowMedForm] = useState(false)
  const [editingVax, setEditingVax] = useState(null)
  const [editingMed, setEditingMed] = useState(null)
  const [loading, setLoading] = useState(true)

  // Vet form
  const [vetName, setVetName] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [vetPhone, setVetPhone] = useState('')

  // Vax form
  const [vaxName, setVaxName] = useState('')
  const [vaxDate, setVaxDate] = useState('')
  const [vaxDueDate, setVaxDueDate] = useState('')

  // Med form
  const [medName, setMedName] = useState('')
  const [medDosage, setMedDosage] = useState('')
  const [medFrequency, setMedFrequency] = useState('')
  const [medRefillDate, setMedRefillDate] = useState('')

  const fetchHealth = async () => {
    const [{ data: vetData }, { data: vaxData }, { data: medData }] = await Promise.all([
      supabase.from('vet_info').select('*').eq('pet_id', pet.id).single(),
      supabase.from('vaccinations').select('*').eq('pet_id', pet.id),
      supabase.from('medications').select('*').eq('pet_id', pet.id),
    ])
    setVet(vetData || null)
    setVaccinations(vaxData || [])
    setMedications(medData || [])
    setLoading(false)
  }

  useEffect(() => { fetchHealth() }, [])

  // Vet handlers
  const handleSaveVet = async () => {
    const data = { pet_id: pet.id, vet_name: vetName, clinic_name: clinicName, phone: vetPhone }
    if (vet) {
      await supabase.from('vet_info').update(data).eq('id', vet.id)
    } else {
      await supabase.from('vet_info').insert(data)
    }
    setShowVetForm(false)
    fetchHealth()
  }

  const handleEditVet = () => {
    setVetName(vet?.vet_name || '')
    setClinicName(vet?.clinic_name || '')
    setVetPhone(vet?.phone || '')
    setShowVetForm(true)
  }

  // Vax handlers
  const resetVaxForm = () => {
    setVaxName(''); setVaxDate(''); setVaxDueDate('')
    setEditingVax(null); setShowVaxForm(false)
  }

  const handleSaveVax = async () => {
    if (!vaxName) return
    const data = { pet_id: pet.id, vaccine_name: vaxName, date_given: vaxDate || null, due_date: vaxDueDate || null }
    if (editingVax) {
      await supabase.from('vaccinations').update(data).eq('id', editingVax.id)
    } else {
      await supabase.from('vaccinations').insert(data)
    }
    resetVaxForm()
    fetchHealth()
  }

  const handleEditVax = (vax) => {
    setEditingVax(vax)
    setVaxName(vax.vaccine_name)
    setVaxDate(vax.date_given || '')
    setVaxDueDate(vax.due_date || '')
    setShowVaxForm(true)
  }

  // Med handlers
  const resetMedForm = () => {
    setMedName(''); setMedDosage(''); setMedFrequency(''); setMedRefillDate('')
    setEditingMed(null); setShowMedForm(false)
  }

  const handleSaveMed = async () => {
    if (!medName) return
    const data = { pet_id: pet.id, name: medName, dosage: medDosage, frequency: medFrequency, refill_date: medRefillDate || null }
    if (editingMed) {
      await supabase.from('medications').update(data).eq('id', editingMed.id)
    } else {
      await supabase.from('medications').insert(data)
    }
    resetMedForm()
    fetchHealth()
  }

  const handleEditMed = (med) => {
    setEditingMed(med)
    setMedName(med.name)
    setMedDosage(med.dosage || '')
    setMedFrequency(med.frequency || '')
    setMedRefillDate(med.refill_date || '')
    setShowMedForm(true)
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading health info...</p>

  return (
    <div className="space-y-4">

      {/* Vet Info */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-700">🏥 Vet Information</h3>
          <button onClick={handleEditVet} className="text-teal-500 text-sm font-medium hover:text-teal-700">
            {vet ? 'Edit' : '+ Add'}
          </button>
        </div>

        {vet && !showVetForm ? (
          <div className="space-y-1 text-sm">
            <p className="font-medium text-gray-800">{vet.vet_name}</p>
            {vet.clinic_name && <p className="text-gray-400">{vet.clinic_name}</p>}
            {vet.phone && <p className="text-teal-600">📞 {vet.phone}</p>}
          </div>
        ) : !showVetForm ? (
          <p className="text-gray-400 text-sm">No vet info added yet</p>
        ) : null}

        {showVetForm && (
          <div className="space-y-3 mt-3">
            <input type="text" placeholder="Vet's name" value={vetName}
              onChange={e => setVetName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <input type="text" placeholder="Clinic name" value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <input type="text" placeholder="Phone number" value={vetPhone}
              onChange={e => setVetPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <div className="flex gap-2">
              <button onClick={handleSaveVet} className="flex-1 bg-teal-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-teal-700 transition">Save</button>
              <button onClick={() => setShowVetForm(false)} className="flex-1 bg-gray-100 text-gray-500 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Vaccinations */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">💉 Vaccinations</h3>

        {vaccinations.length === 0 ? (
          <p className="text-gray-400 text-sm mb-3">No vaccinations recorded</p>
        ) : (
          <div className="space-y-3 mb-3">
            {vaccinations.map(vax => (
              <div key={vax.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{vax.vaccine_name}</p>
                    {vax.date_given && <p className="text-sm text-gray-400">Given: {vax.date_given}</p>}
                    {vax.due_date && (
                      <p className={`text-sm font-medium ${new Date(vax.due_date) < new Date() ? 'text-red-500' : 'text-teal-600'}`}>
                        Due: {vax.due_date} {new Date(vax.due_date) < new Date() ? '⚠️ Overdue' : '✓'}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditVax(vax)} className="text-teal-400 hover:text-teal-600 text-sm font-medium">Edit</button>
                    <button onClick={async () => { await supabase.from('vaccinations').delete().eq('id', vax.id); fetchHealth() }} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showVaxForm ? (
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-semibold text-teal-600">{editingVax ? 'Edit Vaccination' : 'New Vaccination'}</p>
            <input type="text" placeholder="Vaccine name (e.g. Rabies)" value={vaxName}
              onChange={e => setVaxName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Date given</label>
                <input type="date" value={vaxDate} onChange={e => setVaxDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Due date</label>
                <input type="date" value={vaxDueDate} onChange={e => setVaxDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveVax} className="flex-1 bg-teal-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-teal-700 transition">
                {editingVax ? 'Update' : 'Save'}
              </button>
              <button onClick={resetVaxForm} className="flex-1 bg-gray-100 text-gray-500 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowVaxForm(true)} className="w-full border-2 border-dashed border-teal-200 text-teal-500 font-semibold py-2 rounded-xl text-sm hover:border-teal-400 transition">
            + Add Vaccination
          </button>
        )}
      </div>

      {/* Medications */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">💊 Medications</h3>

        {medications.length === 0 ? (
          <p className="text-gray-400 text-sm mb-3">No medications recorded</p>
        ) : (
          <div className="space-y-3 mb-3">
            {medications.map(med => (
              <div key={med.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{med.name}</p>
                    {med.dosage && <p className="text-sm text-gray-400">Dose: {med.dosage}</p>}
                    {med.frequency && <p className="text-sm text-gray-400">⏰ {med.frequency}</p>}
                    {med.refill_date && (
                      <p className={`text-sm font-medium ${new Date(med.refill_date) < new Date() ? 'text-red-500' : 'text-amber-500'}`}>
                        Refill by: {med.refill_date} {new Date(med.refill_date) < new Date() ? '⚠️ Overdue' : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditMed(med)} className="text-teal-400 hover:text-teal-600 text-sm font-medium">Edit</button>
                    <button onClick={async () => { await supabase.from('medications').delete().eq('id', med.id); fetchHealth() }} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showMedForm ? (
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-semibold text-teal-600">{editingMed ? 'Edit Medication' : 'New Medication'}</p>
            <input type="text" placeholder="Medication name" value={medName}
              onChange={e => setMedName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <div className="flex gap-2">
              <input type="text" placeholder="Dosage (e.g. 10mg)" value={medDosage}
                onChange={e => setMedDosage(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <input type="text" placeholder="Frequency (e.g. Daily)" value={medFrequency}
                onChange={e => setMedFrequency(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Refill date</label>
              <input type="date" value={medRefillDate} onChange={e => setMedRefillDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveMed} className="flex-1 bg-teal-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-teal-700 transition">
                {editingMed ? 'Update' : 'Save'}
              </button>
              <button onClick={resetMedForm} className="flex-1 bg-gray-100 text-gray-500 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowMedForm(true)} className="w-full border-2 border-dashed border-teal-200 text-teal-500 font-semibold py-2 rounded-xl text-sm hover:border-teal-400 transition">
            + Add Medication
          </button>
        )}
      </div>

    </div>
  )
}