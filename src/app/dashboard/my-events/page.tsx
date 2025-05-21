"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Calendar, MapPin, Users, Trash2, Edit } from 'lucide-react'

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  image: string
  capacity: number
  totalParticipants: number
}

export default function MyEvents() {
  const router = useRouter()
  const { user } = useUser()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('/api/event/getAllUserEvents', {
          clerkUserId: user?.id
        })
        setEvents(response.data.events)
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchEvents()
    }
  }, [user])

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await axios.post('/api/event/deleteEvent', {
        eventId,
        clerkUserId: user?.id
      })

      if (response.data.success) {
        setEvents(events.filter(event => event._id !== eventId))
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete event')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 min-h-screen flex flex-col justify-center">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">My Events</h1>
        <button
          onClick={() => router.push('/dashboard/create-event')}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
        >
          Create New Event
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">You haven't created any events yet.</p>
          <button
            onClick={() => router.push('/dashboard/create-event')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={event.image || '/placeholder-event.jpg'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm">
                  {event.category}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <p className="text-gray-400 line-clamp-2">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.totalParticipants}/{event.capacity} registered</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => router.push(`/event/${event._id}`)}
                    className="flex-1 px-4 py-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20 transition-colors duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 