"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { Calendar, MapPin, Users, Trash2, Edit, CheckCircle2 } from 'lucide-react'
import VerifyTicketModal from '@/components/VerifyTicketModal'


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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('/api/event/getConductedEvents', {
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

  const handleVerifyClick = (event: Event) => {
    setSelectedEvent(event)
    setIsVerifyModalOpen(true)
  }

  const isEventToday = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    
    // Format dates to YYYY-MM-DD for comparison
    const eventDateStr = eventDate.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    
    return eventDateStr === todayStr
  }

  const getDaysUntilEvent = (date: string) => {
    const eventDate = new Date(date)
    const today = new Date()
    
    // Reset time part for date comparison
    eventDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

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
    <div className="space-y-8 min-h-screen flex flex-col justify-center px-4">
      <div className="flex justify-between items-center mt-20">
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
          {events.map((event) => {
            const daysUntilEvent = getDaysUntilEvent(event.date)
            const isToday = isEventToday(event.date)
            
            return (
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
                    {isToday ? (
                      <button
                        onClick={() => handleVerifyClick(event)}
                        className="flex-1 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Verify Tickets</span>
                      </button>
                    ) : (
                      <div className="flex-1 px-4 py-2 text-center text-yellow-500 bg-yellow-500/10 rounded-lg">
                        <span className="text-sm">
                          {daysUntilEvent > 0
                            ? `${daysUntilEvent} days until event`
                            : 'Event has passed'}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                      title="Delete Event"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedEvent && (
        <VerifyTicketModal
          isOpen={isVerifyModalOpen}
          onClose={() => {
            setIsVerifyModalOpen(false)
            setSelectedEvent(null)
          }}
          eventId={selectedEvent._id}
          eventDate={selectedEvent.date}
        />
      )}
    </div>
  )
} 