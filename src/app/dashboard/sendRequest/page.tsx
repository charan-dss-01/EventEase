"use client"
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

export default function CreateEvent() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    collegeName: '',
    degree: '',
    yearOfPassing: '',
    agenda: '',
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/admin/sendrequest', {
        ...formData,
        clerkUserId: user?.id
      })

      if (response.data.success) {
        setFormData({
          collegeName: '',
          degree: '',
          yearOfPassing: '',
          agenda: '',
        })
        toast.success('Request sent successfully');
      }
    } catch (error: any) {
        toast.error('Failed to send request');
      setError(error.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col justify-center p-4">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mt-8 mb-4">Send Request For College Lead</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
            College Name
          </label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter college name"
          />
        </div>
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-400 mb-2">
            Degree
          </label>
          <input
            type="text"
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter degree"
          />
        </div>
        <div>
          <label htmlFor="passingYear" className="block text-sm font-medium text-gray-400 mb-2">
            Passing Year
          </label>
          <input
            type="text"
            id="passingYear"
            name="yearOfPassing"
            value={formData.yearOfPassing}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter passing year"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
            Agenda
          </label>
          <textarea id="agenda" name="agenda" value={formData.agenda} onChange={handleChange} required rows={4} className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Enter Agenda" />
        </div>

    
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  )
} 