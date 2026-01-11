import React, { useState } from 'react'
import { Plus, Minus, Calculator, Users, Receipt, DollarSign } from 'lucide-react'

function App() {
  const [totalBill, setTotalBill] = useState(0)
  const [gstRate] = useState(7)
  const [serviceChargeRate] = useState(10)
  const [hasServiceCharge, setHasServiceCharge] = useState(true)
  const [people, setPeople] = useState([
    { id: '1', name: '', amount: 0 },
    { id: '2', name: '', amount: 0 }
  ])
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const addPerson = () => {
    const newPerson = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    }
    setPeople([...people, newPerson])
  }

  const removePerson = (id) => {
    if (people.length > 1) {
      setPeople(people.filter(person => person.id !== id))
    }
  }

  const updatePerson = (id, field, value) => {
    setPeople(people.map(person => 
      person.id === id 
        ? { ...person, [field]: value }
        : person
    ))
  }

  const calculateSplit = () => {
    const totalItemsAmount = people.reduce((sum, person) => sum + person.amount, 0)
    
    if (totalItemsAmount === 0) {
      alert('Please enter amounts for at least one person')
      return
    }

    const gstAmount = (totalItemsAmount * gstRate) / 100
    const serviceChargeAmount = hasServiceCharge ? (totalItemsAmount * serviceChargeRate) / 100 : 0

    const calculatedResults = people
      .filter(person => person.amount > 0)
      .map(person => {
        const proportion = person.amount / totalItemsAmount
        const personGst = gstAmount * proportion
        const personServiceCharge = serviceChargeAmount * proportion
        const personTotal = person.amount + personGst + personServiceCharge

        return {
          name: person.name || 'Unnamed Person',
          itemAmount: person.amount,
          taxAmount: personGst,
          serviceChargeAmount: personServiceCharge,
          totalAmount: personTotal
        }
      })

    setResults(calculatedResults)
    setShowResults(true)
  }

  const resetForm = () => {
    setTotalBill(0)
    setPeople([
      { id: '1', name: '', amount: 0 },
      { id: '2', name: '', amount: 0 }
    ])
    setResults([])
    setShowResults(false)
  }

  const totalItemsAmount = people.reduce((sum, person) => sum + person.amount, 0)
  const estimatedGst = (totalItemsAmount * gstRate) / 100
  const estimatedServiceCharge = hasServiceCharge ? (totalItemsAmount * serviceChargeRate) / 100 : 0
  const estimatedTotal = totalItemsAmount + estimatedGst + estimatedServiceCharge

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Bill Splitter</h1>
          </div>
          <p className="text-gray-600 text-lg">Split bills fairly among your group with automatic tax calculations</p>
        </div>

        {!showResults ? (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Receipt className="w-6 h-6 mr-2 text-blue-500" />
                Bill Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Bill Amount (Optional Reference)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={totalBill || ''}
                      onChange={(e) => setTotalBill(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Charge
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hasServiceCharge}
                        onChange={(e) => setHasServiceCharge(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include 10% service charge</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">GST Rate:</span>
                    <p className="font-semibold text-gray-800">{gstRate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Service Charge:</span>
                    <p className="font-semibold text-gray-800">{hasServiceCharge ? `${serviceChargeRate}%` : 'None'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Items Total:</span>
                    <p className="font-semibold text-gray-800">${totalItemsAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Final Total:</span>
                    <p className="font-semibold text-blue-600">${estimatedTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-purple-500" />
                  People & Items ({people.length})
                </h2>
                <button
                  onClick={addPerson}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Person</span>
                </button>
              </div>

              <div className="space-y-4">
                {people.map((person, index) => (
                  <div key={person.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">Person {index + 1}</h3>
                      {people.length > 1 && (
                        <button
                          onClick={() => removePerson(person.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Amount
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={person.amount || ''}
                            onChange={(e) => updatePerson(person.id, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={calculateSplit}
                disabled={totalItemsAmount === 0}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                <Calculator className="w-5 h-5" />
                <span>Calculate Split</span>
              </button>
              
              <button
                onClick={resetForm}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Reset Form
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Receipt className="w-6 h-6 mr-2 text-green-500" />
                Bill Split Results
              </h2>
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                ← Back to Form
              </button>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Items Total</span>
                  <p className="text-lg font-semibold text-gray-800">${totalItemsAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">GST (7%)</span>
                  <p className="text-lg font-semibold text-gray-800">${estimatedGst.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Service Charge</span>
                  <p className="text-lg font-semibold text-gray-800">${estimatedServiceCharge.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Grand Total</span>
                  <p className="text-xl font-bold text-green-600">${estimatedTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Individual Amounts</h3>
              {results.map((result, index) => (
                <div key={index} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{result.name}</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">${result.totalAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total to pay</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Items</span>
                      <p className="font-semibold text-gray-800">${result.itemAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">GST</span>
                      <p className="font-semibold text-gray-800">${result.taxAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Service Charge</span>
                      <p className="font-semibold text-gray-800">${result.serviceChargeAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Percentage</span>
                      <p className="font-semibold text-gray-800">{((result.itemAmount / totalItemsAmount) * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => setShowResults(false)}
                className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                Calculate Another Split
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
