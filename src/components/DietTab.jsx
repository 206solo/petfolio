import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export default function DietTab({ pet }) {
  const [entries, setEntries] = useState([])
  const [allergens, setAllergens] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [mealName, setMealName] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('')
  const [amount, setAmount] = useState('')
  const [foodBrand, setFoodBrand] = useState('')
  const [isCustomRecipe, setIsCustomRecipe] = useState(false)
  const [recipeSteps, setRecipeSteps] = useState('')
  const [newAllergen, setNewAllergen] = useState('')

  const fetchDiet = async () => {
    const [{ data: dietData }, { data: allergenData }] = await Promise.all([
      supabase.from('diet_entries').select('*').eq('pet_id', pet.id),
      supabase.from('allergens').select('*').eq('pet_id', pet.id),
    ])
    setEntries(dietData || [])
    setAllergens(allergenData || [])
    setLoading(false)
  }

  useEffect(() => { fetchDiet() }, [])

  const resetForm = () => {
    setMealName(''); setTimeOfDay(''); setAmount(''); setFoodBrand('')
    setIsCustomRecipe(false); setRecipeSteps('')
    setEditingEntry(null); setShowForm(false)
  }

  const handleEditClick = (entry) => {
    setEditingEntry(entry)
    setMealName(entry.meal_name)
    setTimeOfDay(entry.time_of_day || '')
    setAmount(entry.amount || '')
    setFoodBrand(entry.food_brand || '')
    setIsCustomRecipe(entry.is_custom_recipe || false)
    setRecipeSteps(entry.recipe_steps || '')
    setShowForm(true)
  }

  const handleSaveMeal = async () => {
    if (!mealName) return
    const data = {
      pet_id: pet.id,
      meal_name: mealName,
      time_of_day: timeOfDay,
      amount,
      food_brand: foodBrand,
      is_custom_recipe: isCustomRecipe,
      recipe_steps: recipeSteps,
    }

    if (editingEntry) {
      await supabase.from('diet_entries').update(data).eq('id', editingEntry.id)
    } else {
      await supabase.from('diet_entries').insert(data)
    }
    resetForm()
    fetchDiet()
  }

  const handleAddAllergen = async () => {
    if (!newAllergen) return
    await supabase.from('allergens').insert({ pet_id: pet.id, substance: newAllergen })
    setNewAllergen('')
    fetchDiet()
  }

  const handleDeleteMeal = async (id) => {
    await supabase.from('diet_entries').delete().eq('id', id)
    fetchDiet()
  }

  const handleDeleteAllergen = async (id) => {
    await supabase.from('allergens').delete().eq('id', id)
    fetchDiet()
  }

  if (loading) return <p className="text-gray-400 text-sm">Loading diet info...</p>

  return (
    <div className="space-y-4">

      {/* Allergens */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">⚠️ Allergens & Foods to Avoid</h3>
        {allergens.length === 0 ? (
          <p className="text-gray-400 text-sm">No allergens recorded</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-3">
            {allergens.map(a => (
              <span key={a.id} className="bg-red-50 text-red-600 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                {a.substance}
                <button onClick={() => handleDeleteAllergen(a.id)} className="text-red-300 hover:text-red-500">✕</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Add allergen or food to avoid"
            value={newAllergen}
            onChange={e => setNewAllergen(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button onClick={handleAddAllergen} className="bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-red-100 transition">
            Add
          </button>
        </div>
      </div>

      {/* Meals */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-3">🍽️ Feeding Schedule</h3>

        {entries.length === 0 ? (
          <p className="text-gray-400 text-sm mb-3">No meals added yet</p>
        ) : (
          <div className="space-y-3 mb-3">
            {entries.map(entry => (
              <div key={entry.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{entry.meal_name}</p>
                    {entry.time_of_day && <p className="text-sm text-gray-400">⏰ {entry.time_of_day}</p>}
                    {entry.amount && <p className="text-sm text-gray-400">Amount: {entry.amount}</p>}
                    {entry.food_brand && <p className="text-sm text-gray-400">Brand: {entry.food_brand}</p>}
                    {entry.is_custom_recipe && entry.recipe_steps && (
                      <p className="text-sm text-teal-600 mt-1">📋 Recipe: {entry.recipe_steps}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(entry)}
                      className="text-teal-400 hover:text-teal-600 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMeal(entry.id)}
                      className="text-gray-300 hover:text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm ? (
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-semibold text-teal-600">{editingEntry ? 'Edit Meal' : 'New Meal'}</p>
            <input type="text" placeholder="Meal name (e.g. Breakfast)" value={mealName}
              onChange={e => setMealName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <div className="flex gap-2">
              <input type="text" placeholder="Time (e.g. 7:00 AM)" value={timeOfDay}
                onChange={e => setTimeOfDay(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              <input type="text" placeholder="Amount (e.g. 1 cup)" value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <input type="text" placeholder="Food brand (optional)" value={foodBrand}
              onChange={e => setFoodBrand(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isCustomRecipe} onChange={e => setIsCustomRecipe(e.target.checked)} className="accent-teal-600" />
              <span className="text-sm text-gray-600">This is a homemade recipe</span>
            </label>
            {isCustomRecipe && (
              <textarea placeholder="Recipe steps or ingredients..." value={recipeSteps}
                onChange={e => setRecipeSteps(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 h-24" />
            )}
            <div className="flex gap-2">
              <button onClick={handleSaveMeal} className="flex-1 bg-teal-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-teal-700 transition">
                {editingEntry ? 'Update Meal' : 'Save Meal'}
              </button>
              <button onClick={resetForm} className="flex-1 bg-gray-100 text-gray-500 font-semibold py-2 rounded-xl text-sm hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-teal-200 text-teal-500 font-semibold py-2 rounded-xl text-sm hover:border-teal-400 transition">
            + Add Meal
          </button>
        )}
      </div>

    </div>
  )
}